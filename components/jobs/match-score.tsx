import { cn } from '@/lib/utils';

interface MatchScoreProps {
    score: number;
}

export function MatchScore({ score }: MatchScoreProps) {
    const getScoreColor = (score: number) => {
        if (score >= 70)
            return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900';
        if (score >= 40)
            return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900';
        return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900';
    };

    const getBarColor = (score: number) => {
        if (score >= 70) return 'bg-emerald-500 dark:bg-emerald-600';
        if (score >= 40) return 'bg-amber-500 dark:bg-amber-600';
        return 'bg-rose-500 dark:bg-rose-600';
    };

    return (
        <div className="flex items-center space-x-2">
            <div className={cn('text-xs font-medium px-2 py-1 rounded-md border', getScoreColor(score))}>
                {score}% Match
            </div>
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={cn('h-full rounded-full', getBarColor(score))} style={{ width: `${score}%` }} />
            </div>
        </div>
    );
}
