'use client';

import { useState } from 'react';
import { CalendarIcon, Paperclip, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusIndicator } from '../applications-detail/status-indicator';
import { NoteItem } from '../applications-detail/note-item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

// Mock data for the application
const initialApplication = {
    company: 'Acme Corporation',
    position: 'Frontend Developer',
    status: 'pending',
    source: 'LinkedIn',
    applicationDate: new Date('2025-02-15'),
    interview: {
        date: new Date('2025-03-10'),
        time: '14:00',
        type: 'Video Call',
        notes: 'Prepare to discuss recent projects and React experience.',
    },
    files: [
        { name: 'John_Doe_CV.pdf', type: 'CV' },
        { name: 'John_Doe_Cover_Letter.pdf', type: 'Cover Letter' },
    ],
    notes: [
        {
            id: 1,
            content: "Recruiter mentioned they're looking for someone with 3+ years of React experience.",
            date: new Date('2025-02-16'),
        },
        { id: 2, content: "Need to follow up if I don't hear back by March 5th.", date: new Date('2025-02-20') },
    ],
};

export function DetailPageComponent() {
    const [application, setApplication] = useState(initialApplication);
    const [newNote, setNewNote] = useState('');

    const handleStatusChange = (newStatus: string) => {
        setApplication({
            ...application,
            status: newStatus,
        });
    };

    const handleAddNote = () => {
        if (newNote.trim()) {
            const newNoteObj = {
                id: Date.now(),
                content: newNote,
                date: new Date(),
            };

            setApplication({
                ...application,
                notes: [...application.notes, newNoteObj],
            });

            setNewNote('');
        }
    };

    const handleDeleteNote = (id: number) => {
        setApplication({
            ...application,
            notes: application.notes.filter((note) => note.id !== id),
        });
    };

    const handleSetReminder = () => {
        alert(
            'Reminder set for interview on ' +
                format(application.interview.date, 'MMMM d, yyyy') +
                ' at ' +
                application.interview.time,
        );
    };

    return (
        <Card className="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-lg">
            {/* Top Section - Summary Information */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
                            {application.company}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">{application.position}</p>
                    </div>
                    <StatusIndicator status={application.status} />
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-8 mt-4">
                    <div className="flex items-center">
                        <span className="font-medium mr-2">Source:</span>
                        <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                            {application.source}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-medium mr-2">Applied:</span>
                        <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                            {format(application.applicationDate, 'MMM d, yyyy')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Middle Section - Interview and Files */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-6 bg-gray-50 dark:bg-gray-800/50 border-none">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center">
                                <CalendarIcon className="mr-2 h-5 w-5 text-blue-500" />
                                Interview
                            </h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSetReminder}
                                className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                                Set Reminder
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-gray-900 dark:text-gray-100 font-medium">
                                    {format(application.interview.date, 'MMMM d, yyyy')}
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                                        {application.interview.time}
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm space-y-2">
                                <p className="text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Type:</span> {application.interview.type}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Notes:</span> {application.interview.notes}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Files */}
                    <Card className="p-6 bg-gray-50 dark:bg-gray-800/50 border-none">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center">
                                <Paperclip className="mr-2 h-5 w-5 text-purple-500" />
                                Documents
                            </h3>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            >
                                Add Document
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {application.files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 font-medium mr-3">
                                        {file.type === 'CV' ? 'CV' : 'CL'}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {file.name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{file.type}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Notes Section */}
            <div className="p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-6">Notes</h3>
                <div className="grid gap-4 mb-6">
                    {application.notes.map((note) => (
                        <NoteItem key={note.id} note={note} onDelete={() => handleDeleteNote(note.id)} />
                    ))}
                </div>
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Add a new note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="flex-grow"
                    />
                    <Button onClick={handleAddNote} className="bg-amber-500 hover:bg-amber-600 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Note
                    </Button>
                </div>
            </div>

            {/* Bottom Section - User Actions */}
            <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Status:</span>
                    <Select value={application.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="offer">Offer</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="destructive" className="hover:bg-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Application
                </Button>
            </div>
        </Card>
    );
}
