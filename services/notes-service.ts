import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

const supabase = createClient();

export interface NoteFormValues {
    content: string;
    importance?: 'low' | 'medium' | 'high';
}

export const notesService = {
    async createNote(applicationId: string, values: NoteFormValues) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const now = new Date().toISOString();
            
            const { error: noteError, data } = await supabase.from('application_notes').insert({
                application_id: applicationId,
                user_id: user.id,
                content: values.content,
                importance: values.importance || 'medium',
            }).select();

            if (noteError) throw noteError;
            
            const { error: updateError } = await supabase
                .from('job_applications')
                .update({
                    last_update: now
                })
                .eq('id', applicationId)
                .eq('user_id', user.id);
                
            if (updateError) throw updateError;

            toast.success('Note added successfully');
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error creating note:', error);
            toast.error('Failed to add note', {
                description: 'Please try again later.',
            });
            return { success: false, data: null };
        }
    },

    async updateNote(noteId: string, values: NoteFormValues) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');
            
            const now = new Date().toISOString();

            const { data: noteData, error: fetchError } = await supabase
                .from('application_notes')
                .select('application_id')
                .eq('id', noteId)
                .eq('user_id', user.id)
                .single();
                
            if (fetchError) throw fetchError;
            
            const { error: noteError, data } = await supabase
                .from('application_notes')
                .update({
                    content: values.content,
                    importance: values.importance,
                    updated_at: now,
                })
                .eq('id', noteId)
                .eq('user_id', user.id)
                .select();

            if (noteError) throw noteError;
            
            const { error: updateError } = await supabase
                .from('job_applications')
                .update({
                    last_update: now
                })
                .eq('id', noteData.application_id)
                .eq('user_id', user.id);
                
            if (updateError) throw updateError;

            toast.success('Note updated successfully');
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error updating note:', error);
            toast.error('Failed to update note');
            return { success: false, data: null };
        }
    },

    async deleteNote(noteId: string) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');
            
            const { data: noteData, error: fetchError } = await supabase
                .from('application_notes')
                .select('application_id')
                .eq('id', noteId)
                .eq('user_id', user.id)
                .single();
                
            if (fetchError) throw fetchError;
            
            const { error: deleteError } = await supabase
                .from('application_notes')
                .delete()
                .eq('id', noteId)
                .eq('user_id', user.id);

            if (deleteError) throw deleteError;
            
            const now = new Date().toISOString();
            const { error: updateError } = await supabase
                .from('job_applications')
                .update({
                    last_update: now
                })
                .eq('id', noteData.application_id)
                .eq('user_id', user.id);
                
            if (updateError) throw updateError;

            toast.success('Note deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting note:', error);
            toast.error('Failed to delete note');
            return false;
        }
    },

    async getNotesByApplicationId(applicationId: string) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('application_notes')
                .select('*')
                .eq('application_id', applicationId)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error fetching notes:', error);
            toast.error('Failed to load notes');
            return { success: false, data: [] };
        }
    },

    async getNoteById(noteId: string) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('application_notes')
                .select('*')
                .eq('id', noteId)
                .eq('user_id', user.id)
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error fetching note:', error);
            return { success: false, data: null };
        }
    },

    async deleteNotesByApplicationId(applicationId: string) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('application_notes')
                .delete()
                .eq('application_id', applicationId)
                .eq('user_id', user.id);

            if (error) throw error;

            return true;
        } catch (error) {
            console.error('Error deleting application notes:', error);
            return false;
        }
    }
}; 