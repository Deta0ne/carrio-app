export function generateSlug(title: string, company: string, id: string) {
    const slugify = (text: string): string => {
        if (!text) return '';
        
        return text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const slugifiedTitle = slugify(title);
    const slugifiedCompany = slugify(company);
    
    const safeTitle = slugifiedTitle || 'job';
    const safeCompany = slugifiedCompany || 'company';

    const shortId = id.split('-')[0];

    return `${safeTitle}-at-${safeCompany}-${shortId}`;
}

export function extractIdFromSlug(slug: string): string | null {
    try {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
            return slug;
        }
        
        if (/^[0-9a-f]{8}$/i.test(slug)) {
            return slug;
        }
        
        const parts = slug.split('-');
        
        if (parts.length < 1) {
            return null;
        }
        
        const shortId = parts[parts.length - 1];
        
        if (!shortId || !/^[0-9a-f]{8}$/i.test(shortId)) {
            return null;
        }

        return shortId;
    } catch (error) {
        return null;
    }
} 