'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const issueTypes = [
    'Account Issues',
    'Technical Problems',
    'Feature Request',
    'Job Application Issues',
    'Other',
] as const;

const guestFormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    issueType: z.enum(issueTypes, {
        required_error: 'Please select an issue type.',
    }),
    description: z
        .string()
        .min(10, {
            message: 'Description must be at least 10 characters.',
        })
        .max(1000, {
            message: 'Description must not be longer than 1000 characters.',
        }),
});

type GuestSupportFormValues = z.infer<typeof guestFormSchema>;

const GuestSupportRequestForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<GuestSupportFormValues>({
        resolver: zodResolver(guestFormSchema),
        defaultValues: {
            name: '',
            email: '',
            description: '',
        },
    });

    async function onSubmit(values: GuestSupportFormValues) {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            const response = await fetch('/api/support', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            form.reset();
            setIsSuccess(true);
            console.log('Guest support request submitted:', values);
        } catch (err: any) {
            setError(err.message);
            console.error('Submission error:', err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight">Submit a Support Request</h2>
                <p className="text-sm text-muted-foreground">
                    Fill out the form below and our support team will get back to you as soon as possible.
                </p>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" disabled={isLoading} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="issueType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Issue Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an issue type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {issueTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Please describe your issue in detail"
                                    className="resize-none"
                                    rows={6}
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>Provide as much detail as possible.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Request'}
                </Button>

                {isSuccess && (
                    <p className="text-sm text-green-600">
                        Your request has been submitted successfully! We'll get back to you via email.
                    </p>
                )}
                {error && <p className="text-sm text-red-600">Error: {error}</p>}
            </form>
        </Form>
    );
};

export default GuestSupportRequestForm;
