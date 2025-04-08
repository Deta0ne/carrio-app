import * as z from 'zod';

export const preferencesFormSchema = z.object({
  positions: z.array(z.string())
    .min(1, { message: 'Please add at least one position.' })
    .max(5, { message: 'You can add up to 5 positions.' }),
  
  workArrangement: z.enum(['remote', 'hybrid', 'onsite'], {
    required_error: 'Please select a work arrangement.',
  }),
  
  location: z.string()
    .min(2, { message: 'Location must be at least 2 characters.' })
    .max(100, { message: 'Location must not exceed 100 characters.' }),
});

export type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

export const mockPreferences: PreferencesFormValues = {
  positions: ['Software Engineer', 'Product Manager', 'Data Analyst'],
  workArrangement: 'remote',
  location: 'San Francisco, CA',
};

export const transformPreferencesFormValues = (values: PreferencesFormValues, userId: string) => {
  return {
    id: userId,
    positions: values.positions,
    work_arrangement: values.workArrangement,
    location: values.location,
    updated_at: new Date().toISOString()
  };
}; 