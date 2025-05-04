'use client';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isRecoverySession, setIsRecoverySession] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const recoveryEventDetected = useRef(false);

    useEffect(() => {
        let isMounted = true;
        setCheckingSession(true);
        recoveryEventDetected.current = false;

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isMounted) return;

            console.log('Auth Event in Reset Form:', event);
            if (event === 'PASSWORD_RECOVERY') {
                console.log('PASSWORD_RECOVERY event handled');
                recoveryEventDetected.current = true;
                setIsRecoverySession(true);
                setCheckingSession(false);
            } else if (session && !recoveryEventDetected.current) {
                console.log('Normal session detected, redirecting to /home');
                router.push('/home');
            } else if (!session) {
                console.log('No session detected');
                setIsRecoverySession(false);
                setCheckingSession(false);
            }
        });

        supabase.auth
            .getSession()
            .then(({ data }) => {
                if (!isMounted) return;
                if (checkingSession) {
                    if (data.session && !recoveryEventDetected.current) {
                        console.log('Initial check found normal session, redirecting');
                        router.push('/home');
                    } else if (!data.session) {
                        console.log('Initial check found no session');
                        setIsRecoverySession(false);
                        setCheckingSession(false);
                    }
                }
            })
            .catch(() => {
                if (!isMounted) return;
                if (checkingSession) {
                    console.log('Initial check error');
                    setIsRecoverySession(false);
                    setCheckingSession(false);
                }
            });

        return () => {
            isMounted = false;
            console.log('Unsubscribing Auth Listener in Reset Form');
            authListener?.subscription.unsubscribe();
        };
    }, [supabase, router]);

    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(data: ResetPasswordInput) {
        if (!isRecoverySession) {
            setError('Cannot update password. Invalid or expired link.');
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
            console.error('Password reset error:', error);
            let errorMessage = 'An unexpected error occurred. Please try again.';
            if (error.message) {
                if (error.message.includes('Password should be at least 6 characters')) {
                    errorMessage = 'Password should be at least 6 characters.';
                } else if (error.message.includes('same password')) {
                    errorMessage = 'New password cannot be the same as the old password.';
                } else if (error.message.includes('weak password')) {
                    errorMessage = 'Password is too weak. Please choose a stronger password.';
                } else if (error.code === 'same_password') {
                    errorMessage = 'New password cannot be the same as the old password.';
                } else {
                    errorMessage = `Error: ${error.message}`;
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    if (checkingSession) {
        return <div className="p-8 text-center">Verifying link...</div>;
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

    if (!isRecoverySession) {
        return (
            <div className="flex flex-col items-center gap-6 p-8 text-center">
                <Alert variant="destructive">
                    <AlertDescription>
                        <h3 className="mb-2 text-lg font-semibold">Invalid or Expired Link</h3>
                        <p className="text-sm text-muted-foreground">
                            This password reset link is either invalid or has expired.
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
