import { cn } from '@/lib/utils';

interface StatusTagProps {
    status: 'active' | 'closed' | 'pending';
}

export function StatusTag({ status }: StatusTagProps) {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900';
            case 'closed':
                return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
            case 'pending':
                return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
        }
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
                getStatusStyles(status),
            )}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
