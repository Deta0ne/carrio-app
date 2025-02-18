import { ForgotPasswordForm } from '@/components/forms/forgot-password-form';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function ForgotPasswordPage() {
    const supabase = await createClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session) {
        redirect('/home');
    }
    return <ForgotPasswordForm />;
}
