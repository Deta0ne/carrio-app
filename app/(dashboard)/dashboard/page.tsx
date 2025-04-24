import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { JobMatchingCards } from '@/components/jobs/job-matching-cards';
import { ProfileJobMatch } from '@/types/job-matches';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'A dashboard of your matched job listings',
};

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch job matches for the current user
    const { data: jobMatches, error } = await supabase
        .from('profile_job_matches')
        .select(
            `
            *,
            job_listings(
                id, 
                title, 
                company, 
                location, 
                description, 
                required_skills, 
                preferred_skills, 
                salary_range, 
                job_type, 
                experience_level, 
                status, 
                created_at
            )
        `,
        )
        .eq('profile_id', user.id)
        .order('score', { ascending: false });

    if (error) {
        console.error('Error fetching job matches:', error);
    }

    return (
        <main className="container mx-auto py-8 ">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Job Matches</h1>
            </div>
            <JobMatchingCards jobMatches={(jobMatches as ProfileJobMatch[]) || []} />
        </main>
    );
}
