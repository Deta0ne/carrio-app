import * as z from 'zod';

export const noteFormSchema = z.object({
    content: z.string()
        .min(1, { message: 'Note content is required.' })
        .max(500, { message: 'Note content cannot exceed 500 characters.' }),
    importance: z.enum(['low', 'medium', 'high'], {
        required_error: 'Please select importance level.',
    }),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>; 