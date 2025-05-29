import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { ApplicationFormValues } from '@/lib/validations/application';

const supabase = createClient();

export const applicationsService = {
    async deleteApplication(id: string) {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                console.error('Authentication error:', userError);
                throw new Error('Not authenticated');
            }

            const { error } = await supabase
                .from('job_applications')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;

            await new Promise(resolve => setTimeout(resolve, 100));

            toast.success('Application deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting application:', error);
            toast.error('Failed to delete application');
            return false;
        }
    },

    async createApplication(values: ApplicationFormValues) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const applicationDate = new Date(values.application_date);
            const applicationDateUTC = new Date(
                applicationDate.getTime() - applicationDate.getTimezoneOffset() * 60000,
            );

            const interviewDate = values.interview_date
                ? new Date(values.interview_date.getTime() - values.interview_date.getTimezoneOffset() * 60000)
                : null;

            const { error } = await supabase.from('job_applications').insert({
                id: values.id,
                user_id: user.id,
                company_name: values.company_name,
                position: values.position,
                status: values.status,
                application_date: applicationDateUTC.toISOString().split('T')[0],
                interview_date: interviewDate?.toISOString().split('T')[0] || null,
                source: values.source,
                company_website: values.company_website || null,
            });

            if (error) throw error;

            toast.success('Application created successfully', {
                description: `${values.position} at ${values.company_name}`,
            });
            return true;
        } catch (error) {
            console.error('Error creating application:', error);
            toast.error('Failed to create application', {
                description: 'Please try again later.',
            });
            return false;
        }
    },

    async deleteMultipleApplications(ids: string[]) {
        try {
            const { error } = await supabase
                .from('job_applications')
                .delete()
                .in('id', ids);

            if (error) throw error;

            toast.success(`${ids.length} applications deleted successfully`);
            return true;
        } catch (error) {
            console.error('Error deleting applications:', error);
            toast.error('Failed to delete applications');
            return false;
        }
    },

    async updateApplication(id: string, values: ApplicationFormValues) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const applicationDate = new Date(values.application_date);
            const applicationDateUTC = new Date(
                applicationDate.getTime() - applicationDate.getTimezoneOffset() * 60000,
            );

            const interviewDate = values.interview_date
                ? new Date(values.interview_date.getTime() - values.interview_date.getTimezoneOffset() * 60000)
                : null;

            const { error } = await supabase
                .from('job_applications')
                .update({
                    company_name: values.company_name,
                    position: values.position,
                    status: values.status,
                    application_date: applicationDateUTC.toISOString().split('T')[0],
                    interview_date: interviewDate?.toISOString().split('T')[0] || null,
                    source: values.source,
                    company_website: values.company_website || null,
                    last_update: new Date().toISOString(),
                })
                .eq('id', id);

            if (error) throw error;

            toast.success('Application updated successfully');
            return true;
        } catch (error) {
            console.error('Error updating application:', error);
            toast.error('Failed to update application');
            return false;
        }
    },

    async updateApplicationStatus(id: string, status: string) {
        try {
            
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
                console.error('Authentication error:', userError);
                return false;
            }
            if (!user) {
                console.error('No authenticated user found');
                return false;
            }
            
            const { error } = await supabase
                .from('job_applications')
                .update({
                    status: status,
                    last_update: new Date().toISOString(),
                })
                .eq('id', id)
                .eq('user_id', user.id);
            
            if (error) {
                console.error('Error updating status in Supabase:', error);
                throw error;
            }
            
            return true;
        } catch (error) {
            console.error('Error updating application status:', error);
            return false;
        }
    }
};
