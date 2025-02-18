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

export function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

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
                                <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
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
