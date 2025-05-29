'use server';

import { createClient } from '@/utils/supabase/server';
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput, LoginResult, RegisterResult, ForgotPasswordResult, ResetPasswordResult } from '@/lib/validations/auth';

export async function login(data: LoginInput): Promise<LoginResult> {
    try {
        const supabase = await createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            console.error('Login error:', error);
            
            // Return specific error messages that are safe to serialize
            if (error.message === 'Invalid login credentials') {
                return { success: false, error: 'Invalid email or password' };
            } else if (error.message.includes('Email not confirmed')) {
                return { success: false, error: 'Please verify your email address' };
            } else if (error.message.includes('Too many requests')) {
                return { success: false, error: 'Too many login attempts. Please try again later.' };
            } else {
                return { success: false, error: 'An error occurred while signing in' };
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Login action error:', error);
        // Always return a safe, serializable error
        return { success: false, error: 'An unexpected error occurred during login' };
    }
}

export async function register(data: RegisterInput): Promise<RegisterResult> {
    try {
        const supabase = await createClient();

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    name: data.name,
                    surname: data.surname,
                }
            }
        });

        if (authError) {
            console.error('Signup error:', authError);
            if (authError.message.includes('User already registered')) {
                return { success: false, error: 'This email is already registered' };
            } else {
                return { success: false, error: 'An error occurred during registration' };
            }
        }

        if (authData.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    name: data.name,
                    surname: data.surname,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', authData.user.id);

            if (profileError) {
                console.error('Profile update error:', profileError);
                return { success: false, error: 'Error updating profile' };
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Register action error:', error);
        return { success: false, error: 'An unexpected error occurred during registration' };
    }
}

export async function forgotPassword(data: ForgotPasswordInput): Promise<ForgotPasswordResult> {
    try {
        const supabase = await createClient();

        const { error } = await supabase.auth.resetPasswordForEmail(data.email);

        if (error) {
            console.error('Forgot password error:', error);
            return { success: false, error: 'An error occurred while initiating password reset' };
        }

        return { success: true };
    } catch (error) {
        console.error('Forgot password action error:', error);
        return { success: false, error: 'An unexpected error occurred during password reset request' };
    }
}

export async function resetPassword(data: ResetPasswordInput): Promise<ResetPasswordResult> {
    try {
        const supabase = await createClient();

        const { error } = await supabase.auth.updateUser({
            password: data.password,
        });

        if (error) {
            console.error('Reset password error:', error);
            if (error.message === 'Auth session missing!') {
                return { success: false, error: 'You are using an invalid or expired link. Please click the reset link in your email to try again.' };
            } else if (error.message.includes('Password should be at least 6 characters')) {
                return { success: false, error: 'Password should be at least 6 characters.' };
            } else if (error.message.includes('same password') || error.message.includes('same_password')) {
                return { success: false, error: 'New password cannot be the same as the old password.' };
            } else if (error.message.includes('weak password')) {
                return { success: false, error: 'Password is too weak. Please choose a stronger password.' };
            } else {
                return { success: false, error: 'An error occurred while updating your password' };
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Reset password action error:', error);
        return { success: false, error: 'An unexpected error occurred during password reset' };
    }
}
