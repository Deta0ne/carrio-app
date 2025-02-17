'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth';
import { forgotPassword } from '@/app/(auth)/auth/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    async function onSubmit(data: ForgotPasswordInput) {
        setError(null);
        setLoading(true);

        try {
            const result = await forgotPassword(data);
            if (result.success) {
                setIsSubmitted(true);
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
                        <h3 className="mb-2 text-lg font-semibold">Password Reset Link Sent</h3>
                        <p className="text-sm text-muted-foreground">
                            We have sent a password reset link to {form.getValues('email')}. Please check your email.
                        </p>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your email address and we'll send you a password reset link.
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="m@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {error && <div className="text-sm text-red-500 text-center">{error}</div>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </form>
            </Form>
            <div className="text-center text-sm">
                <a href="/login" className="text-primary underline underline-offset-4 hover:text-primary/90">
                    Back to login
                </a>
            </div>
        </div>
    );
}
