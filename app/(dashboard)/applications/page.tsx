import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { columns } from '../../../components/applications-table/columns';
import { DataTable } from '../../../components/applications-table/data-table';
import { ApplicationCreate } from '@/components/forms/application-form';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Tasks',
    description: 'A task and issue tracker build using Tanstack Table.',
};

export default async function ApplicationsPage() {
    const supabase = await createClient();

    // Get user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Get applications
    const { data: applications } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-4 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                    <p className="text-muted-foreground">Here&apos;s a list of your job applications</p>
                </div>
                <ApplicationCreate />
            </div>
            <DataTable data={applications || []} columns={columns} />
        </div>
    );
}
