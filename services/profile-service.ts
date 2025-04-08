import { createClient } from '@/utils/supabase/client';

export interface Profile {
    id: string;
    email: string;
    name: string;
    surname: string;
    job_title: string;
    experience: string;
    updated_at: string;
    avatar_url: string;
    username?: string;
    bio?: string;
}

export const profileService = {
    async getProfile(userId: string) {
        const supabase = createClient();
        
        const { data, error, status } = await supabase
            .from('profiles')
            .select(`
                email,
                name,
                surname,
                job_title,
                experience,
                avatar_url,
                username,
                bio 
            `)
            .eq('id', userId)
            .single();

        if (error && status !== 406) {
            throw error;
        }

        return data;
    },

    async updateProfile(userId: string, profile: Partial<Profile>) {
        const supabase = createClient();
        
        const { error } = await supabase.from('profiles').upsert({
            id: userId,
            ...profile,
            updated_at: new Date().toISOString(),
        });

        if (error) throw error;
    },

    async uploadAvatar(userId: string, file: File, filePath: string) {
        const supabase = createClient();

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
}; 