'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs } from '@/components/ui/tabs';

interface ProfileTabsClientProps {
    children: React.ReactNode;
    defaultValue?: string;
}

export function ProfileTabsClient({ children, defaultValue = 'profile' }: ProfileTabsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<string | null>(null);

    useEffect(() => {
        const tabFromUrl = searchParams.get('tab');
        setActiveTab(tabFromUrl || defaultValue);
    }, [searchParams, defaultValue]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        const params = new URLSearchParams(searchParams);
        params.set('tab', value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    if (!activeTab) {
        return null;
    }

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            {children}
        </Tabs>
    );
}
