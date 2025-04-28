import { CalendarIcon, ClockIcon, MapPinIcon, BriefcaseIcon, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MatchScore } from '@/components/jobs/match-score';
import { SkillChip } from '@/components/jobs/skill-chip';
import { StatusTag } from '@/components/jobs/status-tag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { applicationsService } from '@/services/applications-service';
import { useRouter } from 'next/navigation';

interface JobCardProps {
    job: {
        id: string;
        title: string;
        company: string;
        location: string;
        jobType: string;
        salary: string;
        matchScore: number;
        experience: string;
        createdAt: string;
        description: string;
        matchingSkills: string[];
        missingSkills: string[];
        preferredSkills: string[];
        status: 'active' | 'closed' | 'pending';
    };
    isApplied: boolean;
}

export function JobCard({ job, isApplied }: JobCardProps) {
    const allSkills = [...new Set([...job.matchingSkills, ...job.preferredSkills, ...job.missingSkills])];
    const router = useRouter();
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const isMatching = (skill: string) => job.matchingSkills.includes(skill);
    const [isApplying, setIsApplying] = useState(false);

    const handleApply = async () => {
        setIsApplying(true);
        try {
            await applicationsService.createApplication({
                id: job.id,
                company_name: job.company,
                position: job.title,
                status: 'pending',
                source: 'Other',
                company_website: '',
                application_date: new Date(),
                interview_date: null,
            });
            router.refresh();
            setTimeout(() => {
                setIsAlertOpen(false);
            }, 1500);
        } catch (error) {
            console.error('Error applying to job:', error);
        }
    };

    return (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col h-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    <StatusTag status={job.status} />
                </div>
            </CardHeader>
            <CardContent className="pb-4 flex-grow">
                <div className="flex flex-col h-full space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>{job.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <BriefcaseIcon className="h-4 w-4 mr-1" />
                            <span>{job.jobType}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-sm">
                            <span className="font-medium text-foreground">{job.salary}</span>
                        </div>
                        <MatchScore score={job.matchScore} />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                        <div className="flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            <span>{job.experience}</span>
                        </div>
                        <div className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            <span>{job.createdAt}</span>
                        </div>
                    </div>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <p className="text-sm text-muted-foreground line-clamp-2 cursor-help">
                                    {job.description}
                                </p>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                                <p className="text-sm">{job.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className="space-y-2">
                        <div>
                            <div className="flex items-center mb-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="max-w-xl">
                                            <p className="text-xs">
                                                <strong>How match score is calculated:</strong>
                                                <br />
                                                • Required skills: 70% weight
                                                <br />
                                                • Preferred skills: 30% weight
                                                <br />
                                                • Matching skills are shown in blue, missing skills in gray
                                                <br />• Blue skills indicate skills present in your CV
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <p className="text-xs font-medium pl-2">Matching and Missing Skills</p>
                                </TooltipProvider>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {allSkills.map((skill) => (
                                    <SkillChip
                                        key={skill}
                                        skill={skill}
                                        type={isMatching(skill) ? 'matching' : 'missing'}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <Button
                    className="w-full"
                    onClick={() => setIsAlertOpen(true)}
                    disabled={isApplied || job.status === 'closed' || isApplying}
                >
                    {isApplied ? 'Applied' : job.status === 'closed' ? 'Closed' : 'Apply'}
                </Button>
            </CardFooter>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Apply to {job.title} at {job.company}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will apply to the job and create a new application in your applications list.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleApply}
                            disabled={isApplying || job.status === 'closed' || isApplied}
                        >
                            {isApplying ? 'Applying...' : 'Apply'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
