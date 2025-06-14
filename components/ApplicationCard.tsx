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
    Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { JobApplication } from '@/types/database';
import { format } from 'date-fns';
import { applicationsService } from '@/services/applications-service';
import { useRouter } from 'next/navigation';
import { DeleteApplicationDialog } from '@/components/applications-table/index';
import Link from 'next/link';
import { ApplicationDialog } from '@/components/applications/application-dialogs';

interface JobCardProps {
    job: JobApplication;
}

const JobCard = ({ job }: JobCardProps) => {
    const router = useRouter();

    const handleDelete = async () => {
        const success = await applicationsService.deleteApplication(job.id);
        if (success) {
            router.refresh();
        }
    };

    const navigateToDetail = () => {
        router.push(`/home/${job.id}`);
    };

    const statusIcons = {
        interview_stage: Users,
        rejected: XCircle,
        offer_received: FileCheck,
        planned: CalendarClock,
        pending: Clock,
    };

    const StatusIcon = statusIcons[job.status as keyof typeof statusIcons] || Briefcase;
    return (
        <Card className="h-full flex flex-col border-border dark:border-gray-800 border-gray-200 relative overflow-hidden bg-gradient-to-t dark:from-black dark:via-[#101725] dark:to-primary/10 from-gray-100 via-gray-50 to-primary/5 transition-all hover:shadow-md">
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
                    {job.status === 'planned' && <Badge variant="secondary">Planned</Badge>}
                    {job.status === 'pending' && <Badge variant="outline">Pending</Badge>}
                    {job.status === 'interview_stage' && <Badge variant="default">Interview</Badge>}
                    {job.status === 'offer_received' && <Badge variant="secondary">Offer</Badge>}
                    {job.status === 'rejected' && <Badge variant="destructive">Rejected</Badge>}
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
                    <Link
                        href={job.company_website}
                        target="_blank"
                        className="text-primary px-0 py-0 h-auto text-sm flex items-center gap-1 mt-2"
                    >
                        <span>Visit company website</span>
                        <ExternalLink size={14} />
                    </Link>
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
                                className={`h-7 w-7 border-border $`}
                                onClick={navigateToDetail}
                            >
                                <Eye size={14} />
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
                                <DropdownMenuContent align="end" className="w-36">
                                    <DropdownMenuItem
                                        className={`flex items-center gap-2 ${
                                            job.company_website ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                                        }`}
                                        onClick={() =>
                                            job.company_website && window.open(job.company_website, '_blank')
                                        }
                                        disabled={!job.company_website}
                                    >
                                        <ExternalLink size={14} />
                                        <span>Company Site</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <ApplicationDialog initialData={job}>
                                        <DropdownMenuItem
                                            className="flex items-center gap-2 cursor-pointer"
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            <Pencil size={14} />
                                            <span>Edit</span>
                                        </DropdownMenuItem>
                                    </ApplicationDialog>
                                    <DeleteApplicationDialog job={job} onDelete={handleDelete}>
                                        <DropdownMenuItem
                                            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            <Trash2 size={14} />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DeleteApplicationDialog>
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
