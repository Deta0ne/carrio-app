'use client';

import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Note {
    id: number;
    content: string;
    date: Date;
}

interface NoteItemProps {
    note: Note;
    onDelete: () => void;
}

export function NoteItem({ note, onDelete }: NoteItemProps) {
    return (
        <div className="rounded-lg p-4 relative bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 shadow-sm">
            <p className="text-sm text-amber-900 dark:text-amber-200 mb-2">{note.content}</p>
            <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-300">
                <span>{format(note.date, 'MMM d, yyyy')}</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    className="text-amber-700 dark:text-amber-300 hover:text-red-600 dark:hover:text-red-400"
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete note</span>
                </Button>
            </div>
        </div>
    );
}
