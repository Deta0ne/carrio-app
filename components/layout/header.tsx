'use client';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ModeToggle } from '@/components/ModeToggle';

export function Header() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumbs />
            </div>
            <div className="flex items-center gap-2">
                <ModeToggle />
            </div>
        </header>
    );
}
