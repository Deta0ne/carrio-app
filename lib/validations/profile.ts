import * as z from 'zod';

export const profileFormSchema = z.object({
  firstName: z.string()
    .min(2, { message: 'First name must be at least 2 characters.' })
    .max(50, { message: 'First name must not exceed 50 characters.' }),
  
  lastName: z.string()
    .min(2, { message: 'Last name must be at least 2 characters.' })
    .max(50, { message: 'Last name must not exceed 50 characters.' }),
  
  email: z.string()
    .email({ message: 'Please enter a valid email address.' })
    .optional(),
  
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters.' })
    .max(30, { message: 'Username must not exceed 30 characters.' })
    .regex(/^[a-zA-Z0-9._-]+$/, { 
      message: 'Username can only contain letters, numbers, and ._- symbols.' 
    })
    .optional()
    .or(z.literal('')),
  
  bio: z.string()
    .max(150, { message: 'Bio must not exceed 150 characters.' })
    .optional()
    .or(z.literal('')),
  
  jobTitle: z.string()
    .max(100, { message: 'Job title must not exceed 100 characters.' })
    .optional()
    .or(z.literal('')),
  
  experience: z.enum(['entry', 'junior', 'mid', 'senior', ''])
    .optional(),
  
  avatar_url: z.string().url().optional().or(z.literal(''))
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// For API submission - transforms the form values to match the backend schema
export const transformProfileFormValues = (values: ProfileFormValues, userId: string) => {
  return {
    id: userId,
    name: values.firstName,
    surname: values.lastName,
    email: values.email,
    username: values.username || undefined,
    bio: values.bio || undefined,
    job_title: values.jobTitle || undefined,
    experience: values.experience || undefined,
    avatar_url: values.avatar_url || undefined,
    updated_at: new Date().toISOString()
  };
}; 