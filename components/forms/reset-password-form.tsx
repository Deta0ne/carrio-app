'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth';
import { resetPassword } from '@/app/(auth)/auth/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

export function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(data: ResetPasswordInput) {
        setError(null);
        setLoading(true);

        try {
            const result = await resetPassword(data);
            if (result.success) {
                setIsSubmitted(true);
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center gap-6 p-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <Alert>
                    <AlertDescription className="text-center">
                        <h3 className="mb-2 text-lg font-semibold">Password Updated!</h3>
                        <p className="text-sm text-muted-foreground">
                            Your password has been successfully updated. Redirecting to home page...
                        </p>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Set New Password</h1>
                <p className="text-balance text-sm text-muted-foreground">Please set your new password</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="At least 6 characters" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Re-enter your password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {error && (
                        <div className="text-sm text-red-500 text-center">
                            {error}
                            {error.includes('Invalid or expired') && (
                                <div className="mt-2">
                                    <a
                                        href="/forgot-password"
                                        className="text-primary underline underline-offset-4 hover:text-primary/90"
                                    >
                                        Get new password reset link
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
