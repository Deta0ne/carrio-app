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
                avatar_url
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
    }
}; 