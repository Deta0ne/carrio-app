'use server';

import { createClient } from '@/utils/supabase/server';
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from '@/lib/validations/auth';

export async function login(data: LoginInput) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });

    if (error) {
        if (error.message === 'Invalid login credentials') {
            throw new Error('Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
            throw new Error('Please verify your email address');
        } else {
            throw new Error('An error occurred while signing in');
        }
    }

    return { success: true };
}

export async function register(data: RegisterInput) {
    const supabase = await createClient();


    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
            data: {
                name: data.name,
                surname: data.surname, 
                avatar_url: null
            }
        },
    });

    if (authError) {
        if (authError.message.includes('User already registered')) {
            throw new Error('This email is already registered');
        } else {
            throw new Error('An error occurred during registration');
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
            throw new Error('Error updating profile');
        }
    }

    return { success: true };
}

export async function forgotPassword(data: ForgotPasswordInput) {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(data.email);

    if (error) {
        throw new Error('An error occurred while initiating password reset');
    }

    return { success: true };
}

export async function resetPassword(data: ResetPasswordInput) {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: data.password,
    });

    if (error) {
        if (error.message === 'Auth session missing!') {
            throw new Error(
                'You are using an invalid or expired link. ' +
                'Please click the reset link in your email to try again.'
            );
        } else if (error.message.includes('Password should be at least 6 characters')) {
            throw new Error('Password should be at least 6 characters.');
        } else if (error.message.includes('same password') || error.message.includes('same_password')) {
            throw new Error('New password cannot be the same as the old password.');
        } else if (error.message.includes('weak password')) {
            throw new Error('Password is too weak. Please choose a stronger password.');
        } else {
            throw new Error('An error occurred while updating your password');
        }
    }

    return { success: true };
}
