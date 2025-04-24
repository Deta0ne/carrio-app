export interface JobListing {
    id: string;
    title: string;
    company: string;
    description: string;
    required_skills: string[];
    preferred_skills: string[];
    salary_range: string;
    location: string;
    job_type: string;
    experience_level: string;
    status: 'active' | 'closed' | 'pending';
    created_at: string;
    updated_at?: string;
}

export interface ProfileJobMatch {
    profile_id: string;
    job_id: string;
    score: number;
    matched_skills: {
        required: string[];
        preferred: string[];
    };
    missing_skills: string[];
    created_at: string;
    job_listings: JobListing;
}

export interface JobCardData {
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
}

export interface JobMatchingCardsProps {
    jobMatches: ProfileJobMatch[];
}