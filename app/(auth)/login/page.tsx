import { Suspense } from 'react';
import { GalleryVerticalEnd } from 'lucide-react';
import Image from 'next/image';
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
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Carrio
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <Suspense fallback={<div>Loading...</div>}>
                            <LoginForm />
                        </Suspense>
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <Image
                    src="/Login.png"
                    sizes="50vw"
                    alt="Image"
                    fill
                    priority
                    className="object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}
