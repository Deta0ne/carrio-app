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
    },
    async saveProfileSkills(profileId: string, 
        skills: string[], 
        categorizedSkills: Record<string, string[]>) {
        const supabase = createClient();
            try {
                const { error } = await supabase
                  .from('profiles')
                  .update({
                    skills: skills,
                    categorized_skills: categorizedSkills
                  })
                  .eq('id', profileId);
                  
                if (error) throw error;
                
                // Uyumluluk skorlarını güncelle
                await supabase.rpc('update_profile_job_matches', { p_profile_id: profileId });
                
                return { success: true };
              } catch (error) {
                console.error('Error saving profile skills:', error);
                return { success: false, error };
            }
    },
    async getMatchingJobs(
        profileId: string, 
        options: { minScore?: number, limit?: number, offset?: number } = {}
      ) {
        const supabase = createClient();
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
    },
    async getProfileSkills(userId: string) {
        const supabase = createClient();
        
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