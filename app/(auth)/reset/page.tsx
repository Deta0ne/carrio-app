import { ResetPasswordForm } from '@/components/forms/reset-password-form';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function ResetPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }
    return <ResetPasswordForm />;
}
