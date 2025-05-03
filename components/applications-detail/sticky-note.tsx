'use client';

import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Note {
    id: number;
    content: string;
    date: Date;
}

interface StickyNoteProps {
    note: Note;
    onDelete: () => void;
}

export function StickyNote({ note, onDelete }: StickyNoteProps) {
    const colors = [
        'bg-amber-50 border-l-amber-400',
        'bg-blue-50 border-l-blue-400',
        'bg-emerald-50 border-l-emerald-400',
        'bg-rose-50 border-l-rose-400',
        'bg-violet-50 border-l-violet-400',
    ];

    const colorIndex = note.id % colors.length;
    const colorClass = colors[colorIndex];

    return (
        <div className={`p-4 rounded-md shadow-sm border-l-4 ${colorClass} relative`}>
            <p className="text-sm mb-3">{note.content}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{format(note.date, 'MMM d, yyyy')}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={onDelete}
                >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Delete note</span>
                </Button>
            </div>
        </div>
    );
}
