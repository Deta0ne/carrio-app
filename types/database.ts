export interface JobApplication {
    id: string
    user_id: string
    company_name: string
    position: string
    status: 'PLANNED' | 'PENDING' | 'INTERVIEW' | 'OFFER' | 'REJECTED'
    application_date: string
    interview_date: string | null
    source: string
    company_website?: string
    created_at: string
    updated_at: string
} 