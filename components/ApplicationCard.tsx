import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    MapPin,
    ExternalLink,
    Briefcase,
    MoreVertical,
    Pencil,
    Trash2,
    Users,
    XCircle,
    FileCheck,
    CalendarClock,
    Clock,
    Link2,
    ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { JobApplication } from '@/types/database';
import { format } from 'date-fns';

export const JobTypeBadge = ({ type }: { type: string }) => {
    const badgeStyles = {
        interview_stage: 'bg-[#22C55E] text-white hover:bg-[#22C55E]/90',
        rejected: 'bg-[#DC2626] text-white hover:bg-[#DC2626]/90',
        offer_received: 'bg-zinc-700 text-white hover:bg-zinc-700/90',
        planned: 'bg-zinc-800 text-white hover:bg-zinc-800/90',
        pending: 'bg-black text-white hover:bg-black/90 border border-zinc-800',
    };

    const style = badgeStyles[type as keyof typeof badgeStyles] || 'bg-zinc-800 text-white';

    return (
        <Badge variant="outline" className={cn('text-xs py-1 px-2 rounded-md border-0', style)}>
            {type === 'interview_stage' && 'Interview'}
            {type === 'rejected' && 'Rejected'}
            {type === 'offer_received' && 'Offer'}
            {type === 'planned' && 'Planned'}
            {type === 'pending' && 'Pending'}
        </Badge>
    );
};

interface JobCardProps {
    job: JobApplication;
    onEdit?: () => void;
    onDelete?: () => void;
}

const JobCard = ({ job, onEdit, onDelete }: JobCardProps) => {
    const statusIcons = {
        interview_stage: Users,
        rejected: XCircle,
        offer_received: FileCheck,
        planned: CalendarClock,
        pending: Clock,
    };

    const StatusIcon = statusIcons[job.status as keyof typeof statusIcons] || Briefcase;
    return (
        <Card className="h-full flex flex-col border-border dark:border-gray-800 border-gray-200 relative overflow-hidden bg-gradient-to-t dark:from-black dark:via-[#101725] dark:to-primary/10 from-gray-100 via-gray-50 to-primary/5">
            {/* HEADER */}
            <CardHeader className="p-6 pb-2">
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-md">
                        <div className="bg-primary text-primary-foreground p-2 rounded-md text-xl flex items-center justify-center">
                            <StatusIcon size={24} />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-foreground">{job.position}</h3>
                        <p className="text-sm text-muted-foreground">
                            Applied on {format(new Date(job.application_date), 'PP')}
                        </p>
                    </div>
                </div>
            </CardHeader>

            {/* CONTENT */}
            <CardContent className="p-6 pt-2 pb-3 flex-grow">
                {/* Status badge */}
                <div className="mb-4 flex flex-wrap gap-2">
                    <JobTypeBadge type={job.status} />
                </div>

                {/* Company details */}
                <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin size={16} className="text-primary" />
                        <span>{job.company_name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Link2 size={16} className="text-primary" />
                        <span>{job.source}</span>
                    </div>
                </div>

                {job.company_website && (
                    <Button
                        variant="link"
                        className="text-primary px-0 py-0 h-auto text-sm flex items-center gap-1 mt-2"
                    >
                        <span>Visit company website</span>
                        <ExternalLink size={14} />
                    </Button>
                )}
            </CardContent>

            {/* FOOTER */}
            <CardFooter className="p-0 mt-auto">
                <div className="w-full px-6 py-3 border-t border-border">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                            {job.interview_date
                                ? `Interview: ${format(new Date(job.interview_date), 'PP')}`
                                : 'No interview scheduled'}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 border-border text-muted-foreground hover:text-primary hover:border-primary"
                            >
                                <ArrowUpRight size={14} />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7 border-border text-muted-foreground hover:text-primary hover:border-primary"
                                    >
                                        <MoreVertical size={14} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32">
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 cursor-pointer"
                                        onClick={onEdit}
                                    >
                                        <Pencil size={14} />
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                                        onClick={onDelete}
                                    >
                                        <Trash2 size={14} />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default JobCard;
