import { CalendarIcon, ClockIcon, MapPinIcon, BriefcaseIcon, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MatchScore } from '@/components/jobs/match-score';
import { SkillChip } from '@/components/jobs/skill-chip';
import { StatusTag } from '@/components/jobs/status-tag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
}

export function JobCard({ job }: JobCardProps) {
    // Combine all skills into one array
    const allSkills = [...new Set([...job.matchingSkills, ...job.preferredSkills, ...job.missingSkills])];

    // Check if a skill is in the matching skills list
    const isMatching = (skill: string) => job.matchingSkills.includes(skill);

    return (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    <StatusTag status={job.status} />
                </div>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="flex flex-col space-y-4">
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
            <CardFooter className="flex justify-between pt-0 gap-4">
                <Button className="w-full">Apply</Button>
                <Button variant="outline" className="w-full">
                    See Details
                </Button>
            </CardFooter>
        </Card>
    );
}
