import * as z from "zod"

export const applicationFormSchema = z.object({
    company_name: z.string().min(1, "Company name is required"),
    position: z.string().min(1, "Position is required"),
    status: z.enum(["pending", "interview_stage", "offer_received", "rejected", "planned"]),
    application_date: z.date({
        required_error: "Application date is required",
    }),
    interview_date: z.date().nullable(),
    source: z.enum(["LinkedIn", "Company Website", "Indeed", "GitHub Jobs", "Career Website", "Other"]),
    company_website: z.string().url().optional().or(z.literal('')),
})

export type ApplicationFormValues = z.infer<typeof applicationFormSchema> 