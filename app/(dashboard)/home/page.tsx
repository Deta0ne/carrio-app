import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { columns, DataTable } from '@/components/applications-table/index';
import { ApplicationCreate } from '@/components/forms/application-form';
import { redirect } from 'next/navigation';
import Loading from './loading';

export const metadata: Metadata = {
    title: 'Applications',
    description: 'A list of your job applications',
};

export default async function ApplicationsPage() {
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
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                        <p className="text-muted-foreground">Here&apos;s a list of your job applications</p>
                    </div>
                    <ApplicationCreate />
                </div>
                <Suspense fallback={<Loading />}>
                    <DataTable data={applications || []} columns={columns} />
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
