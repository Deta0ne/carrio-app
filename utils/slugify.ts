export function generateSlug(title: string, company: string, id: string) {
    const slugify = (text: string): string => {
        if (!text) return '';
        
        const shortId = id.slice(0, 8);
        text = text.toLowerCase().trim();
        
        // Handle both pure non-Latin and mixed text
        const hasNonLatin = /[^\u0000-\u007F]/.test(text);
        if (hasNonLatin) {
            // Keep both non-Latin and Latin characters, just replace spaces and unwanted chars
            const processed = text
                .replace(/[\s\-_]+/g, '-') // replace spaces, hyphens, underscores with single hyphen
                .replace(/[^\p{L}\p{N}\-]/gu, '') // keep only letters, numbers, and hyphens
                .replace(/^-+|-+$/g, ''); // trim hyphens from start and end
            
            return processed + `-${shortId}`; // always append ID for uniqueness
        }
        
        // For Latin-only text, use standard slugification
        return text
            .replace(/[^a-z0-9\-\s]+/g, '') // remove all non-alphanumeric chars except spaces and hyphens
            .replace(/[\s\-_]+/g, '-') // replace spaces, hyphens, underscores with single hyphen
            .replace(/^-+|-+$/g, ''); // trim hyphens from start and end
    };

    const slugifiedTitle = slugify(title);
    const slugifiedCompany = slugify(company);
    
    const safeTitle = slugifiedTitle || `job-${id.slice(0, 8)}`;
    const safeCompany = slugifiedCompany || 'company';

    return `${safeTitle}-at-${safeCompany}`;
}

export function extractIdFromSlug(slug: string, id?: string): string | null {
    if (id) return id;
    
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