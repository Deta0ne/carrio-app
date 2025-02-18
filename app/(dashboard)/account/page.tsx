import AccountForm from '@/components/forms/account-form';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Account() {
    const supabase = await createClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return <AccountForm user={user} />;
}
