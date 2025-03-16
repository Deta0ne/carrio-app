import { DetailPageComponent } from '@/components/pages/detail-page';
import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
    params: {
        slug: string;
    };
}

function normalizeText(text: string): string {
    if (!text) return '';

    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

async function findApplication(slug: string, userId: string) {
    const supabase = await createClient();
    const { data: userApplications } = await supabase.from('job_applications').select('*').eq('user_id', userId);

    if (!userApplications?.length) return null;

    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
        const exactMatch = userApplications.find((app) => app.id === slug);
        if (exactMatch) return exactMatch;
    }

    if (/^[0-9a-f]{8}$/i.test(slug)) {
        const shortIdMatch = userApplications.find((app) => app.id.startsWith(slug));
        if (shortIdMatch) return shortIdMatch;
    }

    const idMatch = slug.match(/-([0-9a-f]{8})$/i);
    if (idMatch) {
        const shortId = idMatch[1];
        const idMatches = userApplications.filter((app) => app.id.startsWith(shortId));

        if (idMatches.length === 1) return idMatches[0];

        if (idMatches.length > 1) {
            const slugParts = slug.split('-at-');
            if (slugParts.length === 2) {
                const position = slugParts[0].replace(/-/g, ' ').toLowerCase();
                const companyWithId = slugParts[1];
                const company = companyWithId
                    .substring(0, companyWithId.length - shortId.length - 1)
                    .replace(/-/g, ' ')
                    .toLowerCase();

                const positionCompanyMatch = idMatches.find((app) => {
                    const appPosition = normalizeText(app.position);
                    const appCompany = normalizeText(app.company_name);

                    const positionWords = position.split(' ').filter((word) => word.length > 2);
                    const companyWords = company.split(' ').filter((word) => word.length > 2);

                    const positionMatch = positionWords.some((word) => appPosition.includes(word));
                    const companyMatch = companyWords.some((word) => appCompany.includes(word));

                    return positionMatch && companyMatch;
                });

                if (positionCompanyMatch) return positionCompanyMatch;
            }

            return idMatches[0];
        }
    }

    const slugParts = slug.split('-at-');
    if (slugParts.length === 2) {
        const position = slugParts[0].replace(/-/g, ' ').toLowerCase();
        const company = slugParts[1].replace(/-/g, ' ').toLowerCase();

        const matches = userApplications.filter((app) => {
            const appPosition = normalizeText(app.position);
            const appCompany = normalizeText(app.company_name);

            const positionWords = position.split(' ').filter((word) => word.length > 2);
            const companyWords = company.split(' ').filter((word) => word.length > 2);

            if (positionWords.length === 0 && companyWords.length === 0) return false;

            const positionMatch =
                positionWords.length === 0 || positionWords.every((word) => appPosition.includes(word));

            const companyMatch = companyWords.length === 0 || companyWords.every((word) => appCompany.includes(word));

            return positionMatch && companyMatch;
        });

        if (matches.length > 0) {
            return matches[0];
        }
    }

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
    const slug = params.slug;

    try {
        const user = await getUserOrRedirect();
        const application = await findApplication(slug, user.id);

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
    const slug = params.slug;

    const user = await getUserOrRedirect();
    const application = await findApplication(slug, user.id);

    if (!application) notFound();

    return <DetailPageComponent application={application} />;
}
