import { cn } from '@/lib/utils';

interface SkillChipProps {
    skill: string;
    type: 'matching' | 'missing';
}

export function SkillChip({ skill, type }: SkillChipProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                type === 'matching'
                    ? 'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
            )}
        >
            {skill}
        </span>
    );
}
