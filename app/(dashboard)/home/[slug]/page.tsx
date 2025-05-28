import { DetailPageComponent } from '@/components/pages/detail-page';
import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{
        id?: string;
    }>;
}

function normalizeText(text: string): string {
    if (!text) return '';

    // Remove any extra whitespace and convert to lowercase
    return text.toLowerCase().trim();
}

async function findApplication(slug: string, userId: string, directId?: string) {
    const supabase = await createClient();

    if (directId) {
        const { data } = await supabase
            .from('job_applications')
            .select('*')
            .eq('id', directId)
            .eq('user_id', userId)
            .single();
        if (data) return data;
    }

    const { data: userApplications } = await supabase.from('job_applications').select('*').eq('user_id', userId);

    if (!userApplications?.length) return null;

    // First try exact UUID match
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
        const exactMatch = userApplications.find((app) => app.id === slug);
        if (exactMatch) return exactMatch;
    }

    // Then try short UUID match
    if (/^[0-9a-f]{8}$/i.test(slug)) {
        const shortIdMatch = userApplications.find((app) => app.id.startsWith(slug));
        if (shortIdMatch) return shortIdMatch;
    }

    // Try to match by position and company name
    const slugParts = slug.split('-at-');
    if (slugParts.length === 2) {
        const position = slugParts[0].replace(/-/g, ' ');
        const company = slugParts[1].replace(/-/g, ' ');

        // If there's an ID at the end, extract it
        const idMatch = company.match(/-([0-9a-f]{8})$/i);
        const shortId = idMatch ? idMatch[1] : null;
        const companyName = shortId ? company.slice(0, -shortId.length - 1) : company;

        const matches = userApplications.filter((app) => {
            const appPosition = normalizeText(app.position);
            const appCompany = normalizeText(app.company_name);
            const normalizedPosition = normalizeText(position);
            const normalizedCompany = normalizeText(companyName);

            // If we have a shortId, make sure it matches
            if (shortId && !app.id.startsWith(shortId)) {
                return false;
            }

            // Check if either position or company name contains the search term
            const positionMatch = appPosition.includes(normalizedPosition) || normalizedPosition.includes(appPosition);
            const companyMatch = appCompany.includes(normalizedCompany) || normalizedCompany.includes(appCompany);

            return positionMatch && companyMatch;
        });

        if (matches.length > 0) {
            // If we have multiple matches and a shortId, prefer the one with matching ID
            if (shortId && matches.length > 1) {
                const idMatch = matches.find((app) => app.id.startsWith(shortId));
                if (idMatch) return idMatch;
            }
            return matches[0];
        }
    }

    // Last resort: try to find any application with matching ID
    const lastResortMatch = slug.match(/[0-9a-f]{8}/i);
    if (lastResortMatch) {
        const shortId = lastResortMatch[0];
        return userApplications.find((app) => app.id.startsWith(shortId));
    }

    return null;
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
    const searchParams = await props.searchParams;
    const slug = decodeURIComponent(params.slug);
    const id = searchParams.id;

    try {
        const user = await getUserOrRedirect();
        const application = await findApplication(slug, user.id, id);

        if (application) {
            return {
                title: `${application.position} at ${application.company_name}`,
                description: `Application details for ${application.position} at ${application.company_name}`,
            };
        }
    } catch (error) {}

    return { title: 'Application Detail' };
}

export default async function ApplicationDetailPage(props: PageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const slug = decodeURIComponent(params.slug);
    const id = searchParams.id;

    const user = await getUserOrRedirect();
    const application = await findApplication(slug, user.id, id);

    if (!application) notFound();

    return <DetailPageComponent application={application} />;
}
