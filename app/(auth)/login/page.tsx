// app/(auth)/login/page.tsx
import { LoginForm } from '@/components/forms/login-form'; // LoginForm'u import et
import { ShowLoginMessage } from '@/components/ShowLoginMessage'; // Yeni bileşeni import et
import { Suspense } from 'react';

// Opsiyonel: Login sayfasında zaten giriş yapmış kullanıcı kontrolü
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
    // Layout'tan kaldırdığımız kontrolü buraya ekleyebiliriz
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (user) {
        redirect('/home'); // Veya dashboard
    }

    return (
        <div className="w-full max-w-md space-y-6">
            {/* Suspense Boundary */}
            <Suspense fallback={<div className="h-10 mb-4"></div>}>
                {' '}
                {/* Yüklenirken boşluk */}
                <ShowLoginMessage />
            </Suspense>
            <LoginForm />
        </div>
    );
}
