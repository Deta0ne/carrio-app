'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs } from '@/components/ui/tabs';

interface ProfileTabsClientProps {
    children: React.ReactNode;
    defaultValue?: string;
}

export function ProfileTabsClient({ children, defaultValue = 'profile' }: ProfileTabsClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string>(defaultValue);
    const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        if (!isInitializedRef.current && typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const tabFromUrl = urlParams.get('tab');

            if (tabFromUrl) {
                setActiveTab(tabFromUrl);
            }

            isInitializedRef.current = true;
        }
    }, []);

    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            const urlParams = new URLSearchParams(window.location.search);
            const tabFromUrl = urlParams.get('tab') || defaultValue;
            setActiveTab(tabFromUrl);
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
            if (urlUpdateTimeoutRef.current) {
                clearTimeout(urlUpdateTimeoutRef.current);
            }
        };
    }, [defaultValue]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);

        if (urlUpdateTimeoutRef.current) {
            clearTimeout(urlUpdateTimeoutRef.current);
        }

        urlUpdateTimeoutRef.current = setTimeout(() => {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('tab', value);

            const isSameTab = window.location.search.includes(`tab=${value}`);
            if (!isSameTab) {
                router.push(currentUrl.pathname + currentUrl.search, { scroll: false });
            }
        }, 150);
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            {children}
        </Tabs>
    );
}
