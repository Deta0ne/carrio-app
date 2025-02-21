import { z } from "zod";

// Job application schema using Zod
export const jobApplicationSchema = z.object({
  id: z.string(), // UUID validasyonunu kaldırdık
  companyName: z.string().min(1, "Company name is required"), // Required company name
  position: z.string().min(1, "Position is required"), // Required job title
  status: z.string(), // Enum yerine string kullanıyoruz
  applicationDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }), // Valid date format
  lastUpdate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }), // Last update timestamp
  interviewDate: z.string().nullable(), // null değerlere izin ver
  source: z.string(), // Enum yerine string kullanıyoruz
});

export type JobApplication = z.infer<typeof jobApplicationSchema>;