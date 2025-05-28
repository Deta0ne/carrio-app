'use client';

import { usePathname } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Fragment } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

export function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const capitalizeWords = (text: string): string => {
        return text
            .split(' ')
            .map((word) => (word.toLowerCase() === 'at' ? 'at' : word.charAt(0).toUpperCase() + word.slice(1)))
            .join(' ');
    };

    const decodePath = (path: string): string => {
        try {
            // First decode URL-encoded characters
            const decoded = decodeURIComponent(path);

            // Remove any 8-character hex ID patterns and clean up
            const withoutIds = decoded.replace(/-[0-9a-f]{8}(?=-|$)/gi, '');

            // Split by "at" to handle both parts separately
            const parts = withoutIds.split('-at-');
            if (parts.length === 2) {
                const [first, second] = parts;
                // Clean and capitalize each part, keeping "at" lowercase
                return [
                    capitalizeWords(first.replace(/-/g, ' ').trim()),
                    'at',
                    capitalizeWords(second.replace(/-/g, ' ').trim()),
                ].join(' ');
            }

            // If no "at" pattern, just clean up and capitalize the text
            return capitalizeWords(withoutIds.replace(/-/g, ' ').trim());
        } catch (error) {
            // If decoding fails, return original with basic cleanup
            return capitalizeWords(path.replace(/-/g, ' ').trim());
        }
    };

    const breadcrumbs = segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const decodedLabel = decodePath(segment);

        return {
            href,
            label: decodedLabel,
            isCurrent: index === segments.length - 1,
        };
    });

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                    <Fragment key={breadcrumb.href}>
                        <BreadcrumbItem>
                            {!breadcrumb.isCurrent ? (
                                <BreadcrumbLink href={breadcrumb.href}>
                                    {isDesktop ? breadcrumb.label : truncateText(breadcrumb.label, 25)}
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>
                                    {isDesktop ? breadcrumb.label : truncateText(breadcrumb.label, 20)}
                                </BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && (
                            <span className="mx-2">
                                <BreadcrumbSeparator />
                            </span>
                        )}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

/**
 * @param text Truncate text
 * @param maxLength Maximum length
 * @returns Truncated text
 */
const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
