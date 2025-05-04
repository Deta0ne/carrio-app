export interface JobApplication {
    id: string
    user_id: string
    company_name: string
    position: string
    status: 'planned' | 'pending' | 'interview_stage' | 'offer_received' | 'rejected'
    application_date: string
    interview_date: string | null
    source: string
    company_website?: string
    created_at: string
    updated_at: string
} 

export interface JobApplications {
    id: string
    user_id: string
    company_name: string
    position: string
    status: 'planned' | 'pending' | 'interview_stage' | 'offer_received' | 'rejected'
    application_date: string
    interview_date: string | null
    source: string
    company_website?: string
    created_at: string
    last_update: string
} 