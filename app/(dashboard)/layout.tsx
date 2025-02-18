import { AppProvider } from '@/providers/app-provider';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { createClient } from '@/utils/supabase/server';
import { Header } from '@/components/layout/header';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('profiles')
        .select(
            `
            id,
            email,
            name,
            surname,
            job_title,
            experience,
            updated_at
        `,
        )
        .eq('id', user?.id)
        .single();

    return (
        <SidebarProvider>
            <AppSidebar initialUser={user} initialProfile={profile} />
            <SidebarInset>
                <Header />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <AppProvider>{children}</AppProvider>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
