import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { JobMatchingCards } from '@/components/jobs/job-matching-cards';
import { ProfileJobMatch } from '@/types/job-matches';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

    const { data: applications } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <main className="container mx-auto py-8 ">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Job Matches</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="gap-1 px-1.5 py-0">
                                    <Database className="h-3 w-3 text-yellow-500" />
                                    <span className="text-xs">Mock Data</span>
                                </Badge>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Currently using mock data for development</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <JobMatchingCards jobMatches={(jobMatches as ProfileJobMatch[]) || []} applications={applications || []} />
        </main>
    );
}
