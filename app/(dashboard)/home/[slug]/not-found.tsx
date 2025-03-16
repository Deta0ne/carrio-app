'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileSearch, Home } from 'lucide-react';

export default function ApplicationNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur-lg"></div>
                        <div className="relative bg-white dark:bg-gray-900 rounded-full p-4">
                            <FileSearch className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Application Not Found</h1>

                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    The application details you're looking for could not be found. The application may have been deleted
                    or the URL might be incorrect.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>

                    <Button asChild className="flex items-center gap-2">
                        <Link href="/home">
                            <Home className="h-4 w-4" />
                            Go to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
