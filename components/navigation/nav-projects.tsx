'use client';

import { Folder, MoreHorizontal, Share, Trash2, type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

export function NavProjects({
    projects,
}: {
    projects: {
        name: string;
        url: string;
        icon: LucideIcon;
    }[];
}) {
    const { isMobile, setOpenMobile } = useSidebar();
    const pathname = usePathname();

    const handleLinkClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((project) => {
                    const isActive = pathname === project.url;

                    return (
                        <SidebarMenuItem key={project.name}>
                            <SidebarMenuButton asChild tooltip={project.name}>
                                <Link
                                    href={project.url}
                                    onClick={handleLinkClick}
                                    className={cn(
                                        'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                                        isActive && 'bg-accent text-accent-foreground',
                                    )}
                                >
                                    <project.icon className="mr-2 h-4 w-4" />
                                    <span>{project.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
