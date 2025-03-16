import { cn } from '@/lib/utils';
import { Clock, CheckCircle2, XCircle, Calendar, MessageSquare, Award } from 'lucide-react';

type StatusType = 'pending' | 'interviewing' | 'offered' | 'rejected' | 'planned';

interface StatusIndicatorProps {
    status: string;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    label: 'Pending',
                    color: 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-900/60 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800/50',
                    icon: <Clock className="w-3.5 h-3.5 mr-1.5 text-yellow-600 dark:text-yellow-400" />,
                    shadow: 'shadow-sm shadow-yellow-200/50 dark:shadow-yellow-900/20',
                };
            case 'interviewing':
                return {
                    label: 'Interview',
                    color: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-900/60 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800/50',
                    icon: <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />,
                    shadow: 'shadow-sm shadow-blue-200/50 dark:shadow-blue-900/20',
                };
            case 'offered':
                return {
                    label: 'Offer',
                    color: 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-900/60 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800/50',
                    icon: <Award className="w-3.5 h-3.5 mr-1.5 text-green-600 dark:text-green-400" />,
                    shadow: 'shadow-sm shadow-green-200/50 dark:shadow-green-900/20',
                };
            case 'rejected':
                return {
                    label: 'Rejected',
                    color: 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-900/60 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800/50',
                    icon: <XCircle className="w-3.5 h-3.5 mr-1.5 text-red-600 dark:text-red-400" />,
                    shadow: 'shadow-sm shadow-red-200/50 dark:shadow-red-900/20',
                };
            case 'planned':
                return {
                    label: 'Planned',
                    color: 'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-900/60 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800/50',
                    icon: <Calendar className="w-3.5 h-3.5 mr-1.5 text-purple-600 dark:text-purple-400" />,
                    shadow: 'shadow-sm shadow-purple-200/50 dark:shadow-purple-900/20',
                };
            default:
                return {
                    label: status,
                    color: 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-800/60 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700/50',
                    icon: <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-600 dark:text-gray-400" />,
                    shadow: 'shadow-sm shadow-gray-200/50 dark:shadow-gray-900/20',
                };
        }
    };

    const { label, color, icon, shadow } = getStatusConfig(status);

    return (
        <div
            className={cn(
                'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium',
                color,
                shadow,
                'transition-all duration-200 hover:scale-105',
            )}
        >
            {icon}
            {label}
        </div>
    );
}
