'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
// import { toast } from 'react-hot-toast'; // Varsa kullanılabilir

// Issue tiplerini tanımlayalım
const issueTypes = [
    'Account Issues',
    'Technical Problems',
    'Feature Request',
    'Job Application Issues',
    'Other',
] as const;

// Zod şemasını tanımlayalım
const formSchema = z.object({
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

type SupportFormValues = z.infer<typeof formSchema>;

const SupportRequestForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<SupportFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: '',
        },
    });

    async function onSubmit(values: SupportFormValues) {
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

            // Başarılı olursa formu sıfırla ve başarı mesajı göster
            form.reset();
            setIsSuccess(true);
            // toast.success('Support request submitted successfully!'); // Toast mesajı
            console.log('Support request submitted:', values); // Geçici log
        } catch (err: any) {
            setError(err.message);
            // toast.error(`Error: ${err.message}`); // Toast mesajı
            console.error('Submission error:', err); // Geçici log
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                {isSuccess && <p className="text-sm text-green-600">Your request has been submitted successfully!</p>}
                {error && <p className="text-sm text-red-600">Error: {error}</p>}
            </form>
        </Form>
    );
};

export default SupportRequestForm;
