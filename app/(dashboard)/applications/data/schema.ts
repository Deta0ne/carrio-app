import { z } from "zod";

export const jobApplicationSchema = z.object({
  id: z.string(), 
  companyName: z.string().min(1, "Company name is required"), 
  position: z.string().min(1, "Position is required"), 
  status: z.enum(["planned", "pending", "interview", "offer", "rejected"]),
  applicationDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }), 
  lastUpdate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }), 
  interviewDate: z.string().nullable(), 
  source: z.string(), 
  companyWebsite: z.string().optional(), 
});

export type JobApplication = z.infer<typeof jobApplicationSchema>;