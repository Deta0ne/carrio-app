import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { HomePage } from '@/components/pages/home-page';

export default async function Home() {
    const supabase = await createClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }
    return (
        <div>
            Successfully logged in{' '}
            <Link href="/applications" className="text-blue-500">
                click here to go to applications page.
            </Link>
            <br />
            <Link href="/account" className="text-blue-500">
                Click here to go to account page.
            </Link>
            <HomePage />
        </div>
    );
}
