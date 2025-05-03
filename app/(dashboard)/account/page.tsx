import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Briefcase, Settings, FileText } from 'lucide-react';
import { ProfileTabsClient } from '@/components/profile/profile-tabs-client';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { DocumentsTab } from '@/components/profile/documents/DocumentsTab';
import { PreferencesTab } from '@/components/profile/PreferencesTab';
import { AccountSettingsTab } from '@/components/profile/AccountSettingsTab';
import { UserProfileSection } from '@/components/profile/ProfileTab';
import { serverProfileService } from '@/services/server-services';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
    title: 'Account',
    description: 'Account settings and preferences',
};

async function getLatestDocument(userId: string) {
    'use server';
    const supabase = await createClient();

    try {
        const { data: potentialOrphans } = await supabase
            .from('documents')
            .select('id, file_path')
            .eq('user_id', userId);

        if (potentialOrphans && potentialOrphans.length > 0) {
            for (const doc of potentialOrphans) {
                try {
                    const { data, error } = await supabase.storage.from('documents').download(doc.file_path);

                    if (error) {
                        console.log(`Cleaning up orphaned document: ${doc.id}`);
                        await supabase.from('documents').delete().eq('id', doc.id);
                    }
                } catch (err) {
                    console.log(`Error checking document, cleaning up: ${doc.id}`);
                    await supabase.from('documents').delete().eq('id', doc.id);
                }
            }
        }
    } catch (err) {
        console.error('Error cleaning up documents:', err);
    }

    const { data: documents } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

    return documents?.[0] || null;
}

function DocumentsLoading() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading document data...</p>
        </div>
    );
}

function ProfileLoading() {
    return (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-sm text-muted-foreground">Loading profile...</p>
        </div>
    );
}

function GenericLoading() {
    return (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-sm text-muted-foreground">Loading...</p>
        </div>
    );
}

export default async function Account() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    let verifiedDocument = null;
    if (user) {
        verifiedDocument = await getLatestDocument(user.id);
    }

    const profileSkills = user ? await serverProfileService.getProfileSkills(user.id) : null;
    const categorizedSkills = profileSkills?.categorized_skills || null;
    const extractedSkills = profileSkills?.skills || null;
    const isSkillsSaved = !!categorizedSkills && Object.keys(categorizedSkills).length > 0;

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
                                    <span>Document Management</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1">
                            <TabsContent value="profile" className="mt-0">
                                <Suspense fallback={<ProfileLoading />}>
                                    <UserProfileSection user={user} />
                                </Suspense>
                            </TabsContent>

                            <TabsContent value="account" className="mt-0">
                                <Suspense fallback={<GenericLoading />}>
                                    <AccountSettingsTab />
                                </Suspense>
                            </TabsContent>

                            <TabsContent value="preferences" className="mt-0">
                                <Suspense fallback={<GenericLoading />}>
                                    <PreferencesTab />
                                </Suspense>
                            </TabsContent>

                            <TabsContent value="documents" className="mt-0">
                                <Suspense fallback={<DocumentsLoading />}>
                                    <DocumentsTab
                                        key={verifiedDocument?.id || 'no-document-' + Date.now()}
                                        initialDocument={verifiedDocument}
                                        initialCategorizedSkills={categorizedSkills}
                                        initialExtractedSkills={extractedSkills}
                                        initialIsSkillsSaved={isSkillsSaved}
                                        defaultActiveTab={verifiedDocument ? 'document' : 'analysis'}
                                    />
                                </Suspense>
                            </TabsContent>
                        </div>
                    </div>
                </ProfileTabsClient>
            </div>
        </main>
    );
}
