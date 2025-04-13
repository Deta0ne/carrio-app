import { JSX } from 'react';
import { Briefcase, InfoIcon, Timer, Users, FileCheck, ListTodo, XCircle } from 'lucide-react';

export function getEventTypeStyles(type: string): string {
    switch (type) {
        case 'interview':
            return 'border-primary/20 bg-primary/10 text-primary';
        default:
            return 'border-muted/20 bg-muted/10 text-muted-foreground';
    }
}

export function getEventTypeColor(type: string): string {
    switch (type) {
        case 'interview':
            return 'bg-primary text-primary-foreground';
        case 'deadline':
            return 'bg-destructive text-destructive-foreground';
        case 'assessment':
            return 'bg-purple-500 text-white dark:bg-purple-600';
        case 'followup':
            return 'bg-amber-500 text-white dark:bg-amber-600';
        default:
            return 'bg-muted text-muted-foreground';
    }
}

export function getEventTypeIcon(type: string): JSX.Element {
    switch (type) {
        case 'interview':
            return <Briefcase className="h-4 w-4" />;
        default:
            return <InfoIcon className="h-4 w-4" />;
    }
}

export function formatEventType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
}

export function getStatusVariant(status: string): string {
    switch (status) {
        case 'pending':
            return 'border-muted/20 bg-muted/10 text-muted-foreground';
        case 'interview_stage':
            return 'border-amber-500/20 bg-amber-500/10 text-amber-500 dark:text-amber-400';
        case 'offer_received':
            return 'border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400';
        case 'planned':
            return 'border-blue-500/20 bg-blue-500/10 text-blue-500 dark:text-blue-400';
        case 'rejected':
            return 'border-destructive/20 bg-destructive/10 text-destructive';
        default:
            return 'border-muted/20 bg-muted/10 text-muted-foreground';
    }
}

export function getStatusIconAndColor(status: string): { icon: JSX.Element; bgColor: string; iconColor: string } {
    switch (status) {
        case 'pending':
            return {
                icon: <Timer className="h-5 w-5" />,
                bgColor: 'bg-muted/10',
                iconColor: 'text-muted-foreground',
            };
        case 'interview_stage':
            return {
                icon: <Users className="h-5 w-5" />,
                bgColor: 'bg-amber-500/10',
                iconColor: 'text-amber-500 dark:text-amber-400',
            };
        case 'offer_received':
            return {
                icon: <FileCheck className="h-5 w-5" />,
                bgColor: 'bg-green-500/10',
                iconColor: 'text-green-500 dark:text-green-400',
            };
        case 'planned':
            return {
                icon: <ListTodo className="h-5 w-5" />,
                bgColor: 'bg-blue-500/10',
                iconColor: 'text-blue-500 dark:text-blue-400',
            };
        case 'rejected':
            return {
                icon: <XCircle className="h-5 w-5" />,
                bgColor: 'bg-destructive/10',
                iconColor: 'text-destructive',
            };
        default:
            return {
                icon: <InfoIcon className="h-5 w-5" />,
                bgColor: 'bg-muted/10',
                iconColor: 'text-muted-foreground',
            };
    }
}

// Date helpers
export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}

export function formatStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
}
