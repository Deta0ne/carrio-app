'use client';

import { useState, useEffect } from 'react';
import { JobCard } from '@/components/jobs/job-card';
import { ProfileJobMatch, JobCardData } from '@/types/job-matches';
import { formatDistanceToNow } from 'date-fns';
import { Pagination } from '@/components/jobs/pagination';
import { FilterBar } from '@/components/jobs/filter-bar';

export type JobFilters = {
    jobType: string[];
    matchScore: string;
    location: string;
    status: string[];
    experience: string;
};

interface JobMatchingCardsProps {
    jobMatches: ProfileJobMatch[];
}

export function JobMatchingCards({ jobMatches }: JobMatchingCardsProps) {
    const convertedJobs: JobCardData[] = jobMatches.map((match) => {
        const matchingSkills = [
            ...(match.matched_skills?.required || []),
            ...(match.matched_skills?.preferred || []),
        ].filter((skill, index, self) => self.indexOf(skill) === index);

        return {
            id: match.job_listings.id,
            title: match.job_listings.title,
            company: match.job_listings.company,
            location: match.job_listings.location,
            jobType: match.job_listings.job_type,
            salary: match.job_listings.salary_range,
            matchScore: match.score,
            experience: match.job_listings.experience_level,
            createdAt: match.job_listings.created_at
                ? formatDistanceToNow(new Date(match.job_listings.created_at), { addSuffix: true })
                : 'Unknown',
            description: match.job_listings.description,
            matchingSkills: matchingSkills,
            missingSkills: match.missing_skills || [],
            preferredSkills: match.job_listings.preferred_skills || [],
            status: match.job_listings.status as 'active' | 'closed' | 'pending',
        };
    });

    const [jobs, setJobs] = useState<JobCardData[]>(convertedJobs);
    const [filteredJobs, setFilteredJobs] = useState<JobCardData[]>(convertedJobs);

    const [filters, setFilters] = useState<JobFilters>({
        jobType: [],
        matchScore: 'all',
        location: '',
        status: [],
        experience: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);

    const locations = Array.from(new Set(jobs.map((job) => job.location)));
    const jobTypes = Array.from(new Set(jobs.map((job) => job.jobType)));
    const statuses = Array.from(new Set(jobs.map((job) => job.status)));
    const experiences = Array.from(new Set(jobs.map((job) => job.experience)));
    useEffect(() => {
        let result = [...jobs];

        if (filters.jobType.length > 0) {
            result = result.filter((job) => filters.jobType.includes(job.jobType));
        }

        if (filters.matchScore !== 'all') {
            if (filters.matchScore === 'high') {
                result = result.filter((job) => job.matchScore >= 70);
            } else if (filters.matchScore === 'medium') {
                result = result.filter((job) => job.matchScore >= 40 && job.matchScore < 70);
            } else if (filters.matchScore === 'low') {
                result = result.filter((job) => job.matchScore < 40);
            }
        }

        if (filters.location && filters.location !== 'all') {
            result = result.filter((job) => job.location === filters.location);
        }

        if (filters.status.length > 0) {
            result = result.filter((job) => filters.status.includes(job.status));
        }

        if (filters.experience && filters.experience !== 'all') {
            result = result.filter((job) => job.experience === filters.experience);
        }

        setFilteredJobs(result);
        setCurrentPage(1);
    }, [filters, jobs]);

    const handleFilterChange = (newFilters: Partial<JobFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const clearFilters = () => {
        setFilters({
            jobType: [],
            matchScore: 'all',
            location: '',
            status: [],
            experience: '',
        });
    };

    const totalPages = Math.ceil(filteredJobs.length / pageSize);

    const currentJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    if (jobs.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-medium mb-2">No job matches found</h3>
                <p className="text-muted-foreground">Complete your profile and add resume to get matched with jobs!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                locations={locations}
                experiences={experiences}
                jobTypes={jobTypes}
                statuses={statuses}
                filteredJobs={filteredJobs}
            />

            {filteredJobs.length === 0 ? (
                <div className="text-center py-10 border rounded-lg bg-muted/20">
                    <h3 className="text-lg font-medium">No jobs match your filters</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your filter criteria</p>
                    <button onClick={clearFilters} className="mt-4 text-sm font-medium text-primary hover:underline">
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={filteredJobs.length}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
