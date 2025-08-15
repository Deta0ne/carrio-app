import * as z from "zod"

export const applicationFormSchema = z.object({
    id: z.string().optional(),
    company_name: z.string()
        .min(3, "Company name is too short")
        .max(100, "Company name cannot exceed 100 characters"),
    position: z.string()
        .min(3, "Position is too short")
        .max(150, "Position title cannot exceed 150 characters"),
    status: z.enum(["draft", "pending", "interview_stage", "offer_received", "rejected", "planned"]),
    application_date: z.date({
        required_error: "Application date is required",
    }),
    interview_date: z.date().nullable(),
    source: z.enum(["LinkedIn", "Company Website", "Indeed", "GitHub Jobs", "Career Website", "Other"]),
    company_website: z.string().url().optional().or(z.literal('')),
})

export type ApplicationFormValues = z.infer<typeof applicationFormSchema> 