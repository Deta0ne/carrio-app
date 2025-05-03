"use server"
import { createClient } from '@/utils/supabase/server';

export interface Document {
    id: string;
    user_id: string;
    name: string;
    size: number;
    type: string;
    file_path: string;
    created_at: string;
    updated_at: string;
}



const sanitizeFileName = (fileName: string): string => {
    return fileName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_{2,}/g, '_');
};

export const uploadDocument = async (file: File): Promise<Document> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const safeFileName = sanitizeFileName(file.name);

    const filePath = `${user.id}/${Date.now()}_${safeFileName}`;
    const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: document, error: dbError } = await supabase
        .from('documents')
        .insert({
            user_id: user.id,
            name: file.name, 
            size: file.size,
            type: file.type,
            file_path: filePath,
        })
        .select()
        .single();

    if (dbError) {
        await supabase.storage.from('documents').remove([filePath]);
        throw dbError;
    }

    return document;
};

export const deleteDocument = async (document: Document) => {
    const supabase = await createClient();
    const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);

    if (storageError) throw storageError;

    const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .match({ id: document.id });

    if (dbError) throw dbError;
};

export const downloadDocument = async (document: Document): Promise<string> => {
    const supabase = await createClient();
    const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 60); 

    if (error) throw error;
    return data.signedUrl;
};

export const getUserDocuments = async (): Promise<Document[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    console.log(data);
    return data;
}; 