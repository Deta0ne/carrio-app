import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { NoteFormValues, notesService } from '@/services/notes-service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

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
    const [values, setValues] = useState<NoteFormValues>(initialValues);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let result;

            if (isEditing && noteId) {
                result = await notesService.updateNote(noteId, values);
            } else {
                result = await notesService.createNote(applicationId, values);
            }

            if (result.success && onSuccess) {
                setValues({ content: '', importance: 'medium' });
                onSuccess();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="content">Note</Label>
                <Textarea
                    id="content"
                    placeholder="Add your notes about this application..."
                    value={values.content}
                    onChange={(e) => setValues({ ...values, content: e.target.value })}
                    required
                    className="min-h-[100px]"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="importance">Importance</Label>
                <Select
                    value={values.importance || 'medium'}
                    onValueChange={(value) => setValues({ ...values, importance: value as 'low' | 'medium' | 'high' })}
                >
                    <SelectTrigger id="importance">
                        <SelectValue placeholder="Select importance" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

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
    );
}
