'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { WifiOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
    const [isOnline, setIsOnline] = useState(true);
    const [isRetrying, setIsRetrying] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsOnline(navigator.onLine);

        function handleOnline() {
            setIsOnline(true);
            router.refresh();
        }

        function handleOffline() {
            setIsOnline(false);
        }

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [router]);

    const handleRetry = async () => {
        if (!navigator.onLine) {
            return;
        }

        setIsRetrying(true);
        try {
            const response = await fetch('/api/health-check');
            if (response.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Connection test failed:', error);
        } finally {
            setIsRetrying(false);
        }
    };

    if (!isOnline) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
                <WifiOff className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">No Internet Connection</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    Please check your internet connection and try again.
                </p>
                <Button onClick={handleRetry} disabled={isRetrying}>
                    {isRetrying ? 'Checking Connection...' : 'Try Again'}
                </Button>
            </div>
        );
    }

    return children;
}
