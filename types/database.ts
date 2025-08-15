export interface JobApplication {
    id: string
    user_id: string
    company_name: string
    position: string
    status: 'draft' | 'planned' | 'pending' | 'interview_stage' | 'offer_received' | 'rejected'
    application_date: string
    interview_date: string | null
    source: string
    company_website?: string
    job_description?: string | null
    location?: string | null
    salary?: string | null
    job_id?: string | null
    application_type?: 'standard' | 'easy' | null
    created_at: string
    updated_at: string
} 

export interface JobApplications {
    id: string
    user_id: string
    company_name: string
    position: string
    status: 'draft' | 'planned' | 'pending' | 'interview_stage' | 'offer_received' | 'rejected'
    application_date: string
    interview_date: string | null
    source: string
    company_website?: string
    job_description?: string | null
    location?: string | null
    salary?: string | null
    job_id?: string | null
    application_type?: 'standard' | 'easy' | null
    created_at: string
    last_update: string
} 