import { cn } from '@/lib/utils';

type StatusType = 'pending' | 'interview' | 'offer' | 'rejected';

interface StatusIndicatorProps {
    status: string;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    label: 'Pending',
                    color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
                };
            case 'interviewing':
                return {
                    label: 'Interview',
                    color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
                };
            case 'offered':
                return {
                    label: 'Offer',
                    color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
                };
            case 'rejected':
                return {
                    label: 'Rejected',
                    color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
                };
            case 'planned':
                return {
                    label: 'Planned',
                    color: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
                };
            default:
                return {
                    label: status,
                    color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
                };
        }
    };

    const { label, color } = getStatusConfig(status);

    return (
        <div className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', color)}>
            {label}
        </div>
    );
}
