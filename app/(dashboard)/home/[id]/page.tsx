import { DetailPageComponent } from '@/components/pages/detail-page';
import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function findApplicationById(id: string, userId: string) {
    const supabase = await createClient();

    const { data: application, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

    if (error || !application) {
        return null;
    }

    return application;
}

async function getUserOrRedirect() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect('/login');
    return user;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const id = decodeURIComponent(params.id);

    try {
        const user = await getUserOrRedirect();
        const application = await findApplicationById(id, user.id);

        if (application) {
            return {
                title: `${application.position} at ${application.company_name}`,
                description: `Application details for ${application.position} at ${application.company_name}`,
            };
        }
    } catch (error) {
        console.error('Error generating metadata:', error);
    }

    return { title: 'Application Detail' };
}

export default async function ApplicationDetailPage(props: PageProps) {
    const params = await props.params;
    const id = decodeURIComponent(params.id);

    const user = await getUserOrRedirect();
    const application = await findApplicationById(id, user.id);

    if (!application) {
        notFound();
    }

    return <DetailPageComponent application={application} />;
}
