import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import Loading from './loading';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<Loading />}>
            <div className="grid min-h-svh lg:grid-cols-2">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex justify-center gap-2 md:justify-start">
                        <a href="/" className="flex items-center gap-2 font-medium">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#34e89e] to-[#0f3443] flex items-center justify-center">
                                <span className="text-lg font-bold text-white">C</span>
                            </div>
                            <span className="font-bold text-xl">Carrio</span>
                        </a>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">{children}</div>
                    </div>
                </div>
                <div className="relative hidden bg-muted lg:block">
                    <Image
                        src="/Login.png"
                        alt="Login background"
                        fill
                        priority
                        className="object-cover"
                        sizes="(min-width: 1024px) 50vw, 0vw"
                    />
                </div>
            </div>
        </Suspense>
    );
}
