import { createClient } from "@/utils/supabase/client";

export const uploadAvatar = async (file: File, filePath: string) => {
    const supabase =  createClient();

    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
            upsert: true,
        });

    if (error) {
        throw error;
    }

    const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    return urlData.publicUrl;
}