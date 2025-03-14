'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 opacity-75 blur-lg"></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-full p-4">
                            <Search className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h1>

                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    The page you are looking for could not be found. It may have been removed, renamed, or is
                    temporarily unavailable.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>

                    <Button asChild className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Go to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
