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

    const breadcrumbs = segments.map((segment, index) => ({
        href: `/${segments.slice(0, index + 1).join('/')}`,
        label: segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        isCurrent: index === segments.length - 1,
    }));

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
 * Belirli bir uzunluktan sonra metni kısaltıp ... ile gösterir
 * @param text Kısaltılacak metin
 * @param maxLength Maksimum karakter uzunluğu
 * @returns Kısaltılmış metin
 */
const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
