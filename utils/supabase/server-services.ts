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
    }
}; 