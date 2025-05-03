import { createClient } from '@/utils/supabase/server';

export const serverProfileService = {
    async getProfileSkills(userId: string) {
        const supabase = await createClient();
        
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    skills,
                    categorized_skills
                `)
                .eq('id', userId)
                .single();

            if (error) throw error;
            
            return data;
        } catch (error) {
            console.error('Error fetching profile skills:', error);
            return null;
        }
    },
    
    async verifyDocument(documentId: string) {
        const supabase = await createClient();
        
        try {
            const { data, error } = await supabase
                .from('documents')
                .select('id, file_path')
                .eq('id', documentId)
                .single();
                
            if (error) {
                if (error.code === '406') {
                    return false;
                }
                throw error;
            }
            
            if (data && data.file_path) {
                try {
                    const { data: fileData, error: fileError } = await supabase
                        .storage
                        .from('documents')
                        .download(data.file_path);
                        
                    if (fileError) {
                        console.error('File referenced in database not found in storage:', fileError);
                        return false;
                    }
                    
                    return !!fileData;
                } catch (fileCheckError) {
                    console.error('Error checking file in storage:', fileCheckError);
                    return false;
                }
            }
            
            return !!data;
        } catch (error) {
            console.error('Error verifying document:', error);
            return false;
        }
    }
}; 