'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { register } from '@/app/(auth)/auth/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(data: RegisterInput) {
        setError(null);
        setLoading(true);

        try {
            const result = await register(data);
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
                        <h3 className="mb-2 text-lg font-semibold">Email Verification Required</h3>
                        <p className="text-sm text-muted-foreground">
                            We've sent a verification link to {form.getValues('email')}. Please check your email.
                        </p>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Sign Up</h1>
                <p className="text-balance text-sm text-muted-foreground">Create an account with your email</p>
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
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
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
                    {error && <div className="text-sm text-red-500 text-center">{error}</div>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </Button>
                </form>
            </Form>
            <div className="text-center text-sm">
                Already have an account?{' '}
                <a href="/login" className="underline underline-offset-4">
                    Sign in
                </a>
            </div>
        </div>
    );
}
