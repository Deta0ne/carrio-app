import { LoginForm } from '@/components/forms/login-form';
import { ShowLoginMessage } from '@/components/ShowLoginMessage';
import { Suspense } from 'react';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (user) {
        redirect('/home');
    }

    return (
        <div className="w-full max-w-md space-y-6">
            <Suspense fallback={<div className="h-10 mb-4"></div>}>
                <ShowLoginMessage />
            </Suspense>
            <LoginForm />
        </div>
    );
}
