'use client';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModeToggle } from '../ModeToggle';

export default function AccountForm({ user }: { user: User | null }) {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [surname, setSurname] = useState<string | null>(null);
    const [jobTitle, setJobTitle] = useState<string | null>(null);
    const [experience, setExperience] = useState<string | null>(null);

    const getProfile = useCallback(async () => {
        try {
            setLoading(true);

            const { data, error, status } = await supabase
                .from('profiles')
                .select(
                    `
                    email,
                    name,
                    surname,
                    job_title,
                    experience
                `,
                )
                .eq('id', user?.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setEmail(data.email);
                setName(data.name);
                setSurname(data.surname);
                setJobTitle(data.job_title);
                setExperience(data.experience);
            }
        } catch (error) {
            alert('Error loading profile!');
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        getProfile();
    }, [user, getProfile]);

    async function updateProfile() {
        try {
            setLoading(true);

            const { error } = await supabase.from('profiles').upsert({
                id: user?.id as string,
                email,
                name,
                surname,
                job_title: jobTitle,
                experience,
                updated_at: new Date().toISOString(),
            });

            if (error) throw error;
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Error updating profile!');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <ModeToggle />
                </div>
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
