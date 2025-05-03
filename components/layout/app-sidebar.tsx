'use client';

import * as React from 'react';
import {
    BookOpen,
    Bot,
    Command,
    Frame,
    LifeBuoy,
    Link,
    Map,
    PieChart,
    Send,
    Settings2,
    SquareTerminal,
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { useUserStore } from '@/providers/store-provider';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavMain, NavUser, NavProjects, NavSecondary } from '@/components/navigation';
import { Profile } from '@/services/profile-service';
const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '',
    },
    navMain: [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: SquareTerminal,
            isActive: true,
        },
        {
            title: 'My Applications',
            url: '/home',
            icon: Bot,
        },
        {
            title: 'Analytics',
            url: '/analytics',
            icon: BookOpen,
        },
        {
            title: 'Calendar',
            url: '/calendar',
            icon: Settings2,
        },
    ],
    navSecondary: [
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
        },
        {
            title: 'Support and Feedback',
            url: '#',
            icon: Send,
        },
    ],
    projects: [
        {
            name: 'Campanies',
            url: '#',
            icon: Frame,
        },
        {
            name: 'Document Management',
            url: '/account?tab=documents',
            icon: PieChart,
        },
        {
            name: 'Email Templates',
            url: '#',
            icon: Map,
        },
    ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    initialUser: User | null;
    initialProfile: Profile | null;
}

export function AppSidebar({ initialUser, initialProfile, ...props }: AppSidebarProps) {
    const setUser = useUserStore((state) => state.setUser);
    const setProfile = useUserStore((state) => state.setProfile);
    const user = useUserStore((state) => state.user);
    useEffect(() => {
        if (initialUser) {
            setUser(initialUser);
        }
        if (initialProfile) {
            setProfile(initialProfile);
        }
    }, [initialUser, initialProfile, setUser, setProfile]);

    const formattedUser = user
        ? {
              name: initialProfile?.name || user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
              email: initialProfile?.email || user.email || '',
              avatar: initialProfile?.avatar_url || '',
          }
        : data.user;

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/home">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Carrio</span>
                                    <span className="truncate text-xs">Enterprise</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={formattedUser} />
            </SidebarFooter>
        </Sidebar>
    );
}
