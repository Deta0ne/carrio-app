import { useEffect, useState } from 'react';
import { notesService, NoteFormValues } from '@/services/notes-service';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, AlertCircle, Info, CheckCircle, Pencil, Plus } from 'lucide-react';
import { NoteForm } from './note-form';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface Note {
    id: string;
    content: string;
    importance: 'low' | 'medium' | 'high';
    created_at: string;
    updated_at: string;
    application_id: string;
    user_id: string;
}

interface NotesListProps {
    applicationId: string;
}

export function NotesList({ applicationId }: NotesListProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchNotes = async () => {
        setLoading(true);
        const result = await notesService.getNotesByApplicationId(applicationId);
        if (result.success) {
            setNotes(result.data as Note[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNotes();
    }, [applicationId]);

    const handleDeleteNote = async () => {
        if (!deleteNoteId) return;

        const success = await notesService.deleteNote(deleteNoteId);
        if (success) {
            setNotes(notes.filter((note) => note.id !== deleteNoteId));
        }
        setDeleteNoteId(null);
    };

    const getImportanceIcon = (importance: string) => {
        switch (importance) {
            case 'high':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            case 'medium':
                return <Info className="h-5 w-5 text-amber-500" />;
            case 'low':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            default:
                return <Info className="h-5 w-5 text-amber-500" />;
        }
    };

    const getImportanceColor = (importance: string) => {
        switch (importance) {
            case 'high':
                return 'text-red-500';
            case 'medium':
                return 'text-amber-500';
            case 'low':
                return 'text-green-500';
            default:
                return 'text-amber-500';
        }
    };

    const getImportanceBorderClass = (importance: string) => {
        switch (importance) {
            case 'high':
                return 'border-l-4 border-red-500';
            case 'medium':
                return 'border-l-4 border-amber-500';
            case 'low':
                return 'border-l-4 border-green-500';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <Pencil className="mr-2 h-5 w-5 text-amber-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Notes</h3>
                    </div>
                </div>
                {[1, 2].map((i) => (
                    <Card key={i} className="p-6 bg-gray-50 dark:bg-gray-800/50 border-none mb-4">
                        <CardHeader className="px-0 pt-0">
                            <Skeleton className="h-5 w-40" />
                        </CardHeader>
                        <CardContent className="px-0 py-2">
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                        <CardFooter className="px-0 pb-0">
                            <Skeleton className="h-4 w-24" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Pencil className="mr-2 h-5 w-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Notes ({notes.length})</h3>
                </div>
                {!showAddForm && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddForm(true)}
                        className="text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Note
                    </Button>
                )}
            </div>

            {showAddForm && (
                <Card className="p-6 bg-gray-50 dark:bg-gray-800/50 border-none mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Add New Note</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAddForm(false)}
                            className="h-8 w-8 p-0 rounded-full"
                        >
                            <span className="sr-only">Close</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </Button>
                    </div>
                    <NoteForm
                        applicationId={applicationId}
                        onSuccess={() => {
                            fetchNotes();
                            setShowAddForm(false);
                        }}
                    />
                </Card>
            )}

            {notes.length === 0 && !showAddForm ? (
                <Card className="p-6 bg-gray-50 dark:bg-gray-800/50 border-none">
                    <CardContent className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                            No notes yet. Add your first note about this application.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setShowAddForm(true)}
                            className="text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Note
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {notes.map((note) => (
                        <Card
                            key={note.id}
                            className={`p-3 bg-white dark:bg-gray-800/50 ${getImportanceBorderClass(note.importance)}`}
                        >
                            {editingNoteId === note.id ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                            Edit Note
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setEditingNoteId(null)}
                                            className="h-8 w-8 p-0 rounded-full"
                                        >
                                            <span className="sr-only">Cancel</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-4 w-4"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </Button>
                                    </div>
                                    <NoteForm
                                        applicationId={applicationId}
                                        noteId={note.id}
                                        initialValues={{
                                            content: note.content,
                                            importance: note.importance,
                                        }}
                                        isEditing
                                        onSuccess={() => {
                                            fetchNotes();
                                            setEditingNoteId(null);
                                        }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center">
                                            {getImportanceIcon(note.importance)}
                                            <h3
                                                className={`ml-2 text-sm font-medium ${getImportanceColor(
                                                    note.importance,
                                                )}`}
                                            >
                                                {note.importance.charAt(0).toUpperCase() + note.importance.slice(1)}{' '}
                                                Priority
                                            </h3>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setEditingNoteId(note.id)}
                                                className="h-8 w-8 rounded-full"
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeleteNoteId(note.id)}
                                                className="h-8 w-8 rounded-full"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm mb-3 break-words whitespace-pre-wrap text-amber-900 dark:text-amber-200">
                                            {note.content}
                                        </p>
                                    </div>
                                    <div className="text-xs text-amber-700 dark:text-amber-300">
                                        {note.updated_at !== note.created_at
                                            ? `Updated ${formatDistanceToNow(new Date(note.updated_at + 'Z'), {
                                                  addSuffix: true,
                                              })}`
                                            : `Added ${formatDistanceToNow(new Date(note.created_at + 'Z'), {
                                                  addSuffix: true,
                                              })}`}
                                    </div>
                                </>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            <AlertDialog open={!!deleteNoteId} onOpenChange={(open) => !open && setDeleteNoteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the note.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteNote}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
