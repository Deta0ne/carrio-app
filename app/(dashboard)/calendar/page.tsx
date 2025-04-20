import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Loading from './loading';
import { Calendar } from '@/components/applications-calendar/calendar';
import { JobApplication } from '@/types/calendar';

export const metadata: Metadata = {
    title: 'Calendar',
    description: 'A calendar of your job application and interview dates',
};

async function getCalendarData(supabase: any, userId: string) {
    const { data, error } = await supabase
        .from('job_applications')
        .select('id, company_name, position, status, application_date, interview_date')
        .not('interview_date', 'is', null)
        .eq('user_id', userId)
        .order('interview_date', { ascending: true });

    if (error) throw error;
    return data;
}

export default async function CalendarPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    try {
        const data = await getCalendarData(supabase, user.id);

        return (
            <div className="h-full flex-1 flex-col space-y-8 md:p-8">
                <Suspense fallback={<Loading />}>
                    <Calendar applications={data as JobApplication[]} />
                </Suspense>
            </div>
        );
    } catch (error) {
        console.error('Error fetching calendar data:', error);

        return (
            <div className="h-full flex-1 flex-col space-y-8 md:p-8">
                <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-8">
                    <h2 className="text-xl font-semibold mb-4">Could not load calendar data</h2>
                    <p>There was an error loading your interview data. Please try again later.</p>
                </div>
            </div>
        );
    }
}
