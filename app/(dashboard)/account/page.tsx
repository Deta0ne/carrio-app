import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Briefcase, Settings, FileText } from 'lucide-react';
import { ProfileTabsClient } from '@/components/profile/profile-tabs-client';
import { UserProfileSection } from '@/components/profile/ProfileTab';
import { PreferencesTab } from '@/components/profile/PreferencesTab';
import { AccountSettingsTab } from '@/components/profile/AccountSettingsTab';
export default async function Account() {
    const supabase = await createClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <main className="min-h-screen bg-background p-4 md:p-8">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-6 text-3xl font-bold tracking-tight">Your Profile</h1>

                <ProfileTabsClient defaultValue="profile">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-64 flex-shrink-0">
                            <TabsList className="flex flex-col h-auto p-1 rounded-lg border bg-dark text-card-foreground shadow-sm w-full sticky top-4 space-y-1">
                                <TabsTrigger
                                    value="profile"
                                    className="w-full justify-start text-sm py-2 px-3 data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 data-[state=active]:text-primary dark:data-[state=active]:text-primary/90 data-[state=active]:border-l-2 data-[state=active]:border-primary"
                                >
                                    <User className="h-4 w-4 mr-2 data-[state=active]:text-primary" />
                                    <span>Profile</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="preferences"
                                    className="w-full justify-start text-sm py-2 px-3 data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 data-[state=active]:text-primary dark:data-[state=active]:text-primary/90 data-[state=active]:border-l-2 data-[state=active]:border-primary"
                                >
                                    <Briefcase className="h-4 w-4 mr-2 data-[state=active]:text-primary" />
                                    <span>Job Preferences</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="account"
                                    className="w-full justify-start text-sm py-2 px-3 data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 data-[state=active]:text-primary dark:data-[state=active]:text-primary/90 data-[state=active]:border-l-2 data-[state=active]:border-primary"
                                >
                                    <Settings className="h-4 w-4 mr-2 data-[state=active]:text-primary" />
                                    <span>Account</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="documents"
                                    className="w-full justify-start text-sm py-2 px-3 data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 data-[state=active]:text-primary dark:data-[state=active]:text-primary/90 data-[state=active]:border-l-2 data-[state=active]:border-primary"
                                >
                                    <FileText className="h-4 w-4 mr-2 data-[state=active]:text-primary" />
                                    <span>Documents</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1">
                            <TabsContent value="profile" className="mt-0">
                                <UserProfileSection user={user} />
                            </TabsContent>

                            <TabsContent value="account" className="mt-0">
                                <AccountSettingsTab />
                            </TabsContent>

                            <TabsContent value="preferences" className="mt-0">
                                <PreferencesTab />
                            </TabsContent>

                            <TabsContent value="documents" className="mt-0">
                                <div className="space-y-4">
                                    <div className="p-6 border rounded-lg shadow-sm">
                                        <h2 className="text-xl font-semibold mb-4">Documents</h2>
                                        <p className="text-muted-foreground">
                                            This section will contain document management.
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </div>
                </ProfileTabsClient>
            </div>
        </main>
    );
}
