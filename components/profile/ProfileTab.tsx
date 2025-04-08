'use client';

import { useState, useEffect } from 'react';
import { type User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2, Edit, Save, AlertCircle } from 'lucide-react';
import { profileService } from '@/services/profile-service';
import { useUserStore } from '@/providers/store-provider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { profileFormSchema, transformProfileFormValues, type ProfileFormValues } from '@/lib/validations/profile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserProfileSectionProps {
    user: User | null;
}

export function UserProfileSection({ user }: UserProfileSectionProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const profile = useUserStore((state) => state.profile);
    const updateProfileInStore = useUserStore((state) => state.updateProfile);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            bio: '',
            jobTitle: '',
            experience: '',
            avatar_url: '',
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (!user) {
            setError('No user found. Please log in again.');
            setIsLoading(false);
            return;
        }

        if (profile) {
            try {
                form.reset({
                    firstName: profile.name || '',
                    lastName: profile.surname || '',
                    email: profile.email || '',
                    username: profile.username || '',
                    bio: profile.bio || '',
                    jobTitle: profile.job_title || '',
                    experience: profile.experience as 'entry' | 'junior' | 'mid' | 'senior' | '',
                    avatar_url: profile.avatar_url || '',
                });

                if (profile.avatar_url) {
                    setImagePreview(profile.avatar_url);
                }

                setError(null);
            } catch (e) {
                console.error('Error processing profile data:', e);
                setError('Error loading profile data. Please refresh the page.');
            } finally {
                setIsLoading(false);
            }
        }
    }, [profile, user, form]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image too large', {
                    description: 'Please select an image smaller than 5MB',
                });
                return;
            }

            setImageFile(file);

            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);

            try {
                setIsSaving(true);
                const filePath = `${user?.id}/avatar`;
                const url = await profileService.uploadAvatar(user?.id as string, file, filePath);

                if (url) {
                    form.setValue('avatar_url', url);
                    toast.success('Avatar updated successfully');
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
                toast.error('Failed to upload avatar');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleCancel = () => {
        if (profile) {
            form.reset({
                firstName: profile.name || '',
                lastName: profile.surname || '',
                email: profile.email || '',
                username: profile.username || '',
                bio: profile.bio || '',
                jobTitle: profile.job_title || '',
                experience: profile.experience as 'entry' | 'junior' | 'mid' | 'senior' | '',
                avatar_url: profile.avatar_url || '',
            });
        }

        if (profile?.avatar_url) {
            setImagePreview(profile.avatar_url);
        }

        setIsEditMode(false);
    };

    const onSubmit = async (values: ProfileFormValues) => {
        if (!user) {
            toast.error('You must be logged in to update your profile');
            return;
        }

        setIsSaving(true);

        try {
            const updateData = transformProfileFormValues(values, user.id);

            await profileService.updateProfile(user.id, updateData);

            updateProfileInStore(updateData);

            setIsEditMode(false);
            toast.success('Profile updated successfully');

            router.refresh();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile', {
                description: 'Please try again later',
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Loading profile information...</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading your profile data</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Error loading profile</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <div className="mt-4 flex justify-end">
                        <Button onClick={() => router.refresh()}>Retry</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card style={{ backgroundColor: 'transparent' }}>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                    Update your profile information and how others see you on the platform
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Avatar section */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage
                                        src={imagePreview || '/placeholder.svg?height=96&width=96'}
                                        alt="Profile"
                                    />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                        {form.getValues('firstName')?.charAt(0) || ''}
                                        {form.getValues('lastName')?.charAt(0) || ''}
                                    </AvatarFallback>
                                </Avatar>
                                {isEditMode && (
                                    <label
                                        htmlFor="profile-image"
                                        className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        <Camera className="h-4 w-4" />
                                        <span className="sr-only">Upload profile picture</span>
                                    </label>
                                )}
                                <input
                                    id="profile-image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    disabled={!isEditMode || isSaving}
                                />
                            </div>
                            {isEditMode && (
                                <p className="text-sm text-muted-foreground">
                                    Click the camera icon to upload a profile picture
                                </p>
                            )}
                        </div>

                        {/* Name fields */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your first name"
                                                readOnly={!isEditMode}
                                                disabled={isSaving}
                                                className={!isEditMode ? 'bg-muted' : ''}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your last name"
                                                readOnly={!isEditMode}
                                                disabled={isSaving}
                                                className={!isEditMode ? 'bg-muted' : ''}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Email field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input type="email" disabled className="bg-muted" {...field} />
                                    </FormControl>
                                    <FormDescription>Contact support to change your email address</FormDescription>
                                </FormItem>
                            )}
                        />

                        {/* Username field */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Choose a username"
                                            readOnly={!isEditMode}
                                            disabled={isSaving}
                                            className={!isEditMode ? 'bg-muted' : ''}
                                            {...field}
                                        />
                                    </FormControl>
                                    {isEditMode && (
                                        <FormDescription>
                                            Your username will be used as your public identity
                                        </FormDescription>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Job Title field */}
                        <FormField
                            control={form.control}
                            name="jobTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Frontend Developer"
                                            readOnly={!isEditMode}
                                            disabled={isSaving}
                                            className={!isEditMode ? 'bg-muted' : ''}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Experience field */}
                        <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Experience Level</FormLabel>
                                    <Select
                                        disabled={!isEditMode || isSaving}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className={!isEditMode ? 'bg-muted' : ''}>
                                                <SelectValue placeholder="Select your experience level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="entry">Entry Level</SelectItem>
                                            <SelectItem value="junior">Junior</SelectItem>
                                            <SelectItem value="mid">Mid-Level</SelectItem>
                                            <SelectItem value="senior">Senior</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Bio field */}
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little about yourself"
                                            className={!isEditMode ? 'bg-muted resize-none' : 'resize-none'}
                                            readOnly={!isEditMode}
                                            disabled={isSaving}
                                            {...field}
                                        />
                                    </FormControl>
                                    {isEditMode && (
                                        <FormDescription>{field.value?.length || 0}/150 characters</FormDescription>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Action buttons */}
                        <div className="flex justify-between items-center pt-2">
                            {!isEditMode ? (
                                <Button type="button" variant="outline" onClick={handleEdit}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSaving || !form.formState.isValid}>
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
