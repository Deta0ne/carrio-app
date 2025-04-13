'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-600 to-teal-600 opacity-75 blur-lg animate-pulse"></div>
                        <div className="relative bg-white dark:bg-gray-900 rounded-full p-4">
                            <div className="flex items-center justify-center">
                                <Loader2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Loading Calendar</h2>

                <p className="text-gray-600 dark:text-gray-400 mb-4">Please wait while we retrieve your calendar...</p>

                <div className="flex justify-center">
                    <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce"></div>
                        <div
                            className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                        ></div>
                        <div
                            className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce"
                            style={{ animationDelay: '0.4s' }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
