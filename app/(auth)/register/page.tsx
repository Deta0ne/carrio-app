import { RegisterForm } from '@/components/forms/register-form';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (user) {
        redirect('/home');
    }
    return <RegisterForm />;
}
