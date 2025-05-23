import { ForgotPasswordForm } from '@/components/forms/forgot-password-form';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ForgotPasswordPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (user) {
        redirect('/home');
    }

    return <ForgotPasswordForm />;
}
