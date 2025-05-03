"use server"
import { createClient } from '@/utils/supabase/server';

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

 export const getProfile = async (userId: string) => {
        const supabase = await createClient();
        
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
}

export const updateProfile = async (userId: string, profile: Partial<Profile>) => {
        const supabase = await createClient();
        
        const { error } = await supabase.from('profiles').upsert({
            id: userId,
            ...profile,
            updated_at: new Date().toISOString(),
        });

        if (error) throw error;
}

export const saveProfileSkills = async (
        skills: string[], 
        categorizedSkills: Record<string, string[]>) => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        const profileId = user.id;
            try {
                const { error } = await supabase
                  .from('profiles')
                  .update({
                    skills: skills,
                    categorized_skills: categorizedSkills
                  })
                  .eq('id', profileId);
                  
                if (error) throw error;
                
                await supabase.rpc('update_profile_job_matches', { p_profile_id: profileId });
                
                return { success: true };
              } catch (error) {
                console.error('Error saving profile skills:', error);
                return { success: false, error };
            }
}
export const getMatchingJobs = async (
        profileId: string, 
        options: { minScore?: number, limit?: number, offset?: number } = {}
      ) => {
        const supabase = await createClient();
        const {
          minScore = 30,
          limit = 10,
          offset = 0
        } = options;
        
        try {
          const { data, error } = await supabase
            .from('profile_job_matches')
            .select(`
              score,
              matched_skills,
              missing_skills,
              job_listings (
                id,
                title,
                company,
                description,
                location,
                job_type,
                salary_range,
                required_skills,
                preferred_skills,
                created_at
              )
            `)
            .eq('profile_id', profileId)
            .gte('score', minScore)
            .order('score', { ascending: false })
            .range(offset, offset + limit - 1);
            
          if (error) throw error;
          return { success: true, jobs: data };
        } catch (error) {
            console.error('Error fetching matching jobs:', error);
            return { success: false, error };
        }
}

export const getProfileSkills = async (userId: string) => {
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