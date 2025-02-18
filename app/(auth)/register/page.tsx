import { RegisterForm } from '@/components/forms/register-form';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function RegisterPage() {
    const supabase = await createClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session) {
        redirect('/home');
    }
    return <RegisterForm />;
}
