// components/auth/show-login-message.tsx (Yeni dosya)
'use client';

import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert'; // Veya uygun bildirim bileşeni

export function ShowLoginMessage() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const error = searchParams.get('error'); // Hata mesajları için de olabilir

    if (message) {
        return (
            <Alert variant="default" className="mb-4">
                {' '}
                {/* veya variant="success" */}
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return null; // Mesaj yoksa hiçbir şey gösterme
}
