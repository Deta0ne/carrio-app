import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { notesService } from '@/services/notes-service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { noteFormSchema, type NoteFormValues } from '@/lib/validations/note';

interface NoteFormProps {
    applicationId: string;
    noteId?: string;
    initialValues?: NoteFormValues;
    onSuccess?: () => void;
    isEditing?: boolean;
}

export function NoteForm({
    applicationId,
    noteId,
    initialValues = { content: '', importance: 'medium' },
    onSuccess,
    isEditing = false,
}: NoteFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<NoteFormValues>({
        resolver: zodResolver(noteFormSchema),
        defaultValues: initialValues,
    });

    const handleSubmit = async (values: NoteFormValues) => {
        setIsSubmitting(true);

        try {
            let result;

            if (isEditing && noteId) {
                result = await notesService.updateNote(noteId, values);
            } else {
                result = await notesService.createNote(applicationId, values);
            }

            if (result.success && onSuccess) {
                form.reset({ content: '', importance: 'medium' });
                onSuccess();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Note</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Textarea
                                        placeholder="Add your notes about this application..."
                                        className="min-h-[100px] pr-16"
                                        maxLength={500}
                                        {...field}
                                    />
                                    <span className="absolute right-2 bottom-2 text-xs text-muted-foreground">
                                        {field.value.length}/500
                                    </span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="importance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Importance</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select importance" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isEditing ? 'Updating...' : 'Adding...'}
                        </>
                    ) : (
                        <>{isEditing ? 'Update Note' : 'Add Note'}</>
                    )}
                </Button>
            </form>
        </Form>
    );
}
