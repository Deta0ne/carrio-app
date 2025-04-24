'use client';

import { useState } from 'react';
import { JobCard } from '@/components/jobs/job-card';
import { ProfileJobMatch, JobCardData } from '@/types/job-matches';
import { formatDistanceToNow } from 'date-fns';
import { Pagination } from '@/components/jobs/pagination';

interface JobMatchingCardsProps {
    jobMatches: ProfileJobMatch[];
}

export function JobMatchingCards({ jobMatches }: JobMatchingCardsProps) {
    // State for jobs data
    const [jobs, setJobs] = useState<JobCardData[]>(
        jobMatches.map((match) => {
            const matchingSkills = [
                ...(match.matched_skills?.required || []),
                ...(match.matched_skills?.preferred || []),
            ].filter((skill, index, self) => self.indexOf(skill) === index);

            // Convert database record to JobCardData format
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
        }),
    );

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);

    // Calculate total pages
    const totalPages = Math.ceil(jobs.length / pageSize);

    // Get current page items
    const currentJobs = jobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of the grid
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle page size change
    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page when changing page size
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
                    totalItems={jobs.length}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}
        </div>
    );
}
