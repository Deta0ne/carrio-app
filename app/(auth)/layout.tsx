import { GalleryVerticalEnd } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
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
    );
}
