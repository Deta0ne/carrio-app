'use client';
import { useCallback, useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { profileService } from '@/services/profile-service';
import { useUserStore } from '@/providers/store-provider';
import Avatar from './avatar';
import { useRouter } from 'next/navigation';
export default function AccountForm({ user }: { user: User | null }) {
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [surname, setSurname] = useState<string | null>(null);
    const [jobTitle, setJobTitle] = useState<string | null>(null);
    const [experience, setExperience] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const router = useRouter();
    const profile = useUserStore((state) => state.profile);

    useEffect(() => {
        if (profile) {
            setEmail(profile.email);
            setName(profile.name);
            setSurname(profile.surname);
            setJobTitle(profile.job_title);
            setExperience(profile.experience);
            setAvatarUrl(profile.avatar_url);
            setLoading(false);
        }
    }, [profile]);

    async function updateProfile() {
        try {
            setLoading(true);
            await profileService.updateProfile(user?.id as string, {
                email: email as string,
                name: name as string,
                surname: surname as string,
                job_title: jobTitle as string,
                experience: experience as string,
                avatar_url: avatarUrl as string,
            });
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Error updating profile!');
        } finally {
            setLoading(false);
            router.refresh();
        }
    }
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Avatar
                    uid={user?.id as string}
                    url={avatarUrl}
                    size={150}
                    onUpload={(url) => {
                        setAvatarUrl(url);
                        updateProfile();
                    }}
                />
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email || ''} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">First Name</Label>
                    <Input id="name" type="text" value={name || ''} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="surname">Last Name</Label>
                    <Input
                        id="surname"
                        type="text"
                        value={surname || ''}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                        id="jobTitle"
                        type="text"
                        value={jobTitle || ''}
                        onChange={(e) => setJobTitle(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select value={experience || ''} onValueChange={(value) => setExperience(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="entry">Entry Level</SelectItem>
                            <SelectItem value="junior">Junior</SelectItem>
                            <SelectItem value="mid">Mid-Level</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-4">
                    <Button onClick={updateProfile} disabled={loading}>
                        {loading ? 'Loading ...' : 'Update'}
                    </Button>

                    <form action="/auth/signout" method="post">
                        <Button variant="destructive" className="w-full" type="submit">
                            Sign Out
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
