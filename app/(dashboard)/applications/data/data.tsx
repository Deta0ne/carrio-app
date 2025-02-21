import { ArrowRight, CheckCircle, Circle, CircleOff, HelpCircle, Timer } from 'lucide-react';

export const sources = [
    {
        value: 'linkedin',
        label: 'LinkedIn',
    },
    {
        value: 'company_website',
        label: 'Company Website',
    },
    {
        value: 'indeed',
        label: 'Indeed',
    },
    {
        value: 'github_jobs',
        label: 'GitHub Jobs',
    },
    {
        value: 'career_website',
        label: 'Career Website',
    },
];

export const statuses = [
    {
        value: 'pending',
        label: 'Pending',
        icon: HelpCircle,
    },
    {
        value: 'interview_stage',
        label: 'Interview Stage',
        icon: Timer,
    },
    {
        value: 'offer_received',
        label: 'Offer Received',
        icon: CheckCircle,
    },
    {
        value: 'rejected',
        label: 'Rejected',
        icon: CircleOff,
    },
];
