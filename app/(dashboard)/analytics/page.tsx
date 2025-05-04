import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { columns, DataTable } from '@/components/applications-table/index';
import { ApplicationCreate } from '@/components/forms/application-form';
import { redirect } from 'next/navigation';
import Loading from '../home/loading';
import AnalyticView from '@/components/analytics/analytic-view';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Analytics',
    description: 'Analytics for your job applications',
};

export default async function AnalyticsPage() {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            redirect('/login');
        }

        const { data: applications } = await supabase
            .from('job_applications')
            .select('*')
            .order('created_at', { ascending: false });

        return (
            <div className="h-full flex-1 flex-col space-y-8 md:p-8">
                <Suspense fallback={<Loading />}>
                    <AnalyticView applications={applications || []} />
                </Suspense>
            </div>
        );
    } catch (error) {
        if (error instanceof Error && error.message.includes('auth')) {
            redirect('/login');
        }
        throw error;
    }
}
