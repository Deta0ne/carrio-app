'use client';
import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

function ResetPasswordFormContent({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const router = useRouter();
    const supabase = createClient();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isRecoveryFlow, setIsRecoveryFlow] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const recoveryParam = searchParams.get('recovery');

        if (recoveryParam === 'true') {
            setIsRecoveryFlow(true);
            setChecking(false);
        } else {
            supabase.auth
                .getSession()
                .then(({ data }) => {
                    if (data.session) {
                        router.push('/home');
                    } else {
                        setIsRecoveryFlow(false);
                    }
                })
                .catch(() => {
                    setIsRecoveryFlow(false);
                })
                .finally(() => {
                    setChecking(false);
                });
        }
    }, [searchParams, supabase, router]);

    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: '', confirmPassword: '' },
    });

    async function onSubmit(data: ResetPasswordInput) {
        if (!isRecoveryFlow) {
            setError('Invalid state for password reset. Please request a new link.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: data.password,
            });
            if (updateError) {
                throw updateError;
            }

            setIsSubmitted(true);
            await supabase.auth.signOut();
            setTimeout(() => {
                router.push('/login?message=Password updated successfully');
            }, 2000);
        } catch (error: any) {
            let errorMessage = 'An unexpected error occurred.';
            if (error.message) {
                if (error.message.includes('Password should be at least 6 characters')) {
                    errorMessage = 'Password should be at least 6 characters.';
                } else if (error.message.includes('same password') || error.code === 'same_password') {
                    errorMessage = 'New password cannot be the same as the old password.';
                } else if (error.message.includes('weak password')) {
                    errorMessage = 'Password is too weak. Please choose a stronger password.';
                } else {
                    errorMessage = `Error: ${error.message}`;
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    if (checking) {
        return <div className="p-8 text-center">Verifying...</div>;
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
                            Your password has been successfully updated. Redirecting to login...
                        </p>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!isRecoveryFlow) {
        return (
            <div className="flex flex-col items-center gap-6 p-8 text-center">
                <Alert variant="destructive">
                    <AlertDescription>
                        <h3 className="mb-2 text-lg font-semibold">Invalid or Expired Link</h3>
                        <p className="text-sm text-muted-foreground">
                            This password reset link is either invalid or has expired. Please request a new one.
                        </p>
                    </AlertDescription>
                </Alert>
                <a
                    href="/forgot-password"
                    className="text-primary underline underline-offset-4 hover:text-primary/90 text-sm"
                >
                    Request a new reset link
                </a>
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
                        <Alert variant="destructive" className="text-center">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export function ResetPasswordForm(props: React.ComponentPropsWithoutRef<'div'>) {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading Reset Form...</div>}>
            <ResetPasswordFormContent {...props} />
        </Suspense>
    );
}
