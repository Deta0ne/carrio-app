'use client';

import { useState } from 'react';
import { CalendarIcon, Paperclip, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusIndicator } from '../applications-detail/status-indicator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface Application {
    id: string;
    user_id: string;
    company_name: string;
    position: string;
    status: 'pending' | 'interviewing' | 'offered' | 'accepted' | 'rejected';
    application_date: string;
    last_update: string;
    interview_date: string | null;
    interview: {
        date: Date;
        time: string;
        type: string;
        notes: string;
    };
    source: string;
    created_at: string;
    company_website: string | null;
    files: Array<{
        name: string;
        type: 'CV' | 'CL';
    }>;
}

interface Note {
    id: string;
    content: string;
    date: Date;
}

export function DetailPageComponent({ application }: { application: Application }) {
    const [currentStatus, setCurrentStatus] = useState(application.status);
    const [newNote, setNewNote] = useState('');

    const staticNotes: Note[] = [
        {
            id: '1',
            content: 'İlk görüşme olumlu geçti, teknik mülakat bekleniyor.',
            date: new Date('2024-03-15'),
        },
        {
            id: '2',
            content: 'Teknik mülakat için hazırlık yapılacak konular: React, TypeScript, Node.js',
            date: new Date('2024-03-16'),
        },
    ];

    const handleDeleteNote = (id: string) => {
        console.log('Delete note:', id);
    };

    const handleSetReminder = () => {
        console.log('Set reminder');
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        setNewNote('');
    };

    return (
        <Card className="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-lg">
            {/* Top Section - Summary Information */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        {application.company_website ? (
                            <a
                                href={application.company_website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-3xl font-semibold text-gray-900 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                {application.company_name}
                            </a>
                        ) : (
                            <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
                                {application.company_name}
                            </h2>
                        )}
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">{application.position}</p>
                    </div>
                    <StatusIndicator status={currentStatus} />
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
                            {format(new Date(application.application_date), 'MMM d, yyyy')}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-medium mr-2">Last Update:</span>
                        <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                            {format(new Date(application.last_update), 'MMM d, yyyy')}
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
                                    March 10, 2025
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">14:00</span>
                                </div>
                            </div>
                            <div className="text-sm space-y-2">
                                <p className="text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Type:</span> Video Call
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Notes:</span> Prepare to discuss recent projects and
                                    React experience.
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
                            <div className="flex items-center p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 font-medium mr-3">
                                    CV
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        John_Doe_CV.pdf
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">CV</div>
                                </div>
                            </div>
                            <div className="flex items-center p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 font-medium mr-3">
                                    CL
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        John_Doe_Cover_Letter.pdf
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Cover Letter</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Notes Section */}
            <div className="p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center mb-6">
                    <Pencil className="mr-2 h-5 w-5 text-amber-500" />
                    Notes
                </h3>
                <div className="grid gap-4 mb-6">
                    {staticNotes.map((note) => (
                        <div
                            key={note.id}
                            className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30 border relative shadow-sm"
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNote(note.id)}
                                className="absolute top-2 right-2 h-6 w-6 p-0 text-amber-700 dark:text-amber-300 hover:text-red-600 dark:hover:text-red-400"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <p className="text-sm mb-3 pr-8 text-amber-900 dark:text-amber-200">{note.content}</p>
                            <p className="text-xs text-amber-700 dark:text-amber-300">
                                {format(note.date, 'dd MMM yyyy', { locale: tr })}
                            </p>
                        </div>
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
                    <Select
                        value={currentStatus}
                        onValueChange={(value: 'pending' | 'interviewing' | 'offered' | 'accepted' | 'rejected') =>
                            setCurrentStatus(value)
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="interviewing">Interview</SelectItem>
                            <SelectItem value="offered">Offer</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
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
