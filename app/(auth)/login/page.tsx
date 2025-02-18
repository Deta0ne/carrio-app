import { LoginForm } from '@/components/forms/login-form';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function LoginPage() {
    const supabase = await createClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session) {
        redirect('/home');
    }
    return <LoginForm />;
}
