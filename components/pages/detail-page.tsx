'use client';

import { useState } from 'react';
import { CalendarIcon, Paperclip, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusIndicator } from '../applications-detail/status-indicator';
import { NoteItem } from '../applications-detail/note-item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        // In a real app, this would integrate with a calendar or notification system
        alert(
            'Reminder set for interview on ' +
                format(application.interview.date, 'MMMM d, yyyy') +
                ' at ' +
                application.interview.time,
        );
    };

    return (
        <div className=" shadow-sm rounded-lg overflow-hidden">
            {/* Top Section - Summary Information */}
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                            {application.company}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{application.position}</p>
                    </div>
                    <StatusIndicator status={application.status} />
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-6">
                    <div>
                        <span className="font-medium">Source:</span> {application.source}
                    </div>
                    <div>
                        <span className="font-medium">Applied:</span>{' '}
                        {format(application.applicationDate, 'MMM d, yyyy')}
                    </div>
                </div>
            </div>

            {/* Middle Section - Interview and Files */}
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Interview Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                            <CalendarIcon className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            Interview
                        </h3>
                        <div className="  rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-gray-800 dark:text-gray-200 font-medium">
                                    {format(application.interview.date, 'MMMM d, yyyy')}
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                                        {application.interview.time}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSetReminder}
                                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                >
                                    Set Reminder
                                </Button>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                <span className="font-medium">Type:</span> {application.interview.type}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Notes:</span> {application.interview.notes}
                            </p>
                        </div>
                    </div>

                    {/* Files */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                            <Paperclip className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            Documents
                        </h3>
                        <div className="space-y-2">
                            {application.files.map((file, index) => (
                                <div key={index} className="flex items-center p-3   rounded-lg">
                                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium mr-3">
                                        {file.type === 'CV' ? 'CV' : 'CL'}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {file.name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{file.type}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes Section */}
            <div className="p-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Notes</h3>
                <div className="space-y-4 mb-6">
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
                    <Button onClick={handleAddNote}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                    </Button>
                </div>
            </div>

            {/* Bottom Section - User Actions */}
            <div className=" px-8 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Status:</span>
                    <Select value={application.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-[140px]">
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
                <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Application
                </Button>
            </div>
        </div>
    );
}
