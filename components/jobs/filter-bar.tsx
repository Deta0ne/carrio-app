'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import type { JobFilters } from './job-matching-cards';

interface FilterBarProps {
    filters: JobFilters;
    onFilterChange: (filters: Partial<JobFilters>) => void;
    onClearFilters: () => void;
    locations: string[];
    jobTypes: string[];
    statuses: string[];
    filteredJobs: any[];
    experiences: string[];
}

export function FilterBar({
    filters,
    onFilterChange,
    onClearFilters,
    locations,
    jobTypes,
    statuses,
    filteredJobs,
    experiences,
}: FilterBarProps) {
    const [open, setOpen] = useState(false);

    const handleJobTypeChange = (jobType: string, checked: boolean) => {
        if (checked) {
            onFilterChange({ jobType: [...filters.jobType, jobType] });
        } else {
            onFilterChange({ jobType: filters.jobType.filter((type) => type !== jobType) });
        }
    };

    const handleStatusChange = (status: string, checked: boolean) => {
        if (checked) {
            onFilterChange({ status: [...filters.status, status] });
        } else {
            onFilterChange({ status: filters.status.filter((s) => s !== status) });
        }
    };

    const handleExperienceChange = (experience: string, checked: boolean) => {
        if (checked) {
            onFilterChange({ experience: experience });
        } else {
            onFilterChange({ experience: '' });
        }
    };
    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.jobType.length > 0) count++;
        if (filters.matchScore !== 'all') count++;
        if (filters.location) count++;
        if (filters.status.length > 0) count++;
        if (filters.experience) count++;
        return count;
    };

    const activeFilterCount = getActiveFilterCount();

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                <Filter className="h-3.5 w-3.5" />
                                <span>Filters</span>
                                {activeFilterCount > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className="ml-1 rounded-full px-1 py-0 h-5 min-w-5 flex items-center justify-center"
                                    >
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle>Filter Jobs</SheetTitle>
                                <SheetDescription>Narrow down job matches based on your preferences</SheetDescription>
                            </SheetHeader>
                            <div className="py-4 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Job Type</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {jobTypes.map((jobType) => (
                                            <div key={jobType} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`job-type-${jobType}`}
                                                    checked={filters.jobType.includes(jobType)}
                                                    onCheckedChange={(checked) =>
                                                        handleJobTypeChange(jobType, checked as boolean)
                                                    }
                                                />
                                                <Label htmlFor={`job-type-${jobType}`}>{jobType}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Match Score</h3>
                                    <RadioGroup
                                        value={filters.matchScore}
                                        onValueChange={(value) => onFilterChange({ matchScore: value })}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="all" id="match-all" />
                                            <Label htmlFor="match-all">All Scores</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="high" id="match-high" />
                                            <Label htmlFor="match-high">High Match (70%+)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="medium" id="match-medium" />
                                            <Label htmlFor="match-medium">Medium Match (40-69%)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="low" id="match-low" />
                                            <Label htmlFor="match-low">Low Match (Below 40%)</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Experience</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {experiences.map((experience) => (
                                            <div key={experience} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`experience-${experience}`}
                                                    checked={filters.experience === experience}
                                                    onCheckedChange={(checked) =>
                                                        handleExperienceChange(experience, checked as boolean)
                                                    }
                                                />
                                                <Label htmlFor={`experience-${experience}`}>{experience}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Location</h3>
                                    <Select
                                        value={filters.location}
                                        onValueChange={(value) => onFilterChange({ location: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All locations" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All locations</SelectItem>
                                            {locations.map((location) => (
                                                <SelectItem key={location} value={location}>
                                                    {location}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Status</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {statuses.map((status) => (
                                            <div key={status} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`status-${status}`}
                                                    checked={filters.status.includes(status)}
                                                    onCheckedChange={(checked) =>
                                                        handleStatusChange(status, checked as boolean)
                                                    }
                                                />
                                                <Label htmlFor={`status-${status}`}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            onClearFilters();
                                            setOpen(false);
                                        }}
                                    >
                                        Reset
                                    </Button>
                                    <Button onClick={() => setOpen(false)}>Apply Filters</Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {activeFilterCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground"
                            onClick={onClearFilters}
                        >
                            Clear filters
                            <X className="ml-1 h-3 w-3" />
                        </Button>
                    )}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                </div>
            </div>

            {activeFilterCount > 0 && (
                <Card className="border-dashed">
                    <CardContent className="py-3 flex flex-wrap gap-2">
                        {filters.jobType.length > 0 && (
                            <Badge variant="secondary" className="gap-1">
                                Job Type: {filters.jobType.join(', ')}
                                <button
                                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                                    onClick={() => onFilterChange({ jobType: [] })}
                                >
                                    <X className="h-3 w-3" />
                                    <span className="sr-only">Remove job type filter</span>
                                </button>
                            </Badge>
                        )}

                        {filters.matchScore !== 'all' && (
                            <Badge variant="secondary" className="gap-1">
                                Match:{' '}
                                {filters.matchScore === 'high'
                                    ? 'High'
                                    : filters.matchScore === 'medium'
                                    ? 'Medium'
                                    : 'Low'}
                                <button
                                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                                    onClick={() => onFilterChange({ matchScore: 'all' })}
                                >
                                    <X className="h-3 w-3" />
                                    <span className="sr-only">Remove match score filter</span>
                                </button>
                            </Badge>
                        )}

                        {filters.location && (
                            <Badge variant="secondary" className="gap-1">
                                Location: {filters.location}
                                <button
                                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                                    onClick={() => onFilterChange({ location: '' })}
                                >
                                    <X className="h-3 w-3" />
                                    <span className="sr-only">Remove location filter</span>
                                </button>
                            </Badge>
                        )}

                        {filters.status.length > 0 && (
                            <Badge variant="secondary" className="gap-1">
                                Status: {filters.status.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                                <button
                                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                                    onClick={() => onFilterChange({ status: [] })}
                                >
                                    <X className="h-3 w-3" />
                                    <span className="sr-only">Remove status filter</span>
                                </button>
                            </Badge>
                        )}

                        {filters.experience && (
                            <Badge variant="secondary" className="gap-1">
                                Experience: {filters.experience}
                            </Badge>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
