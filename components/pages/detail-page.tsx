'use client';

import { useState } from 'react';
import { CalendarIcon, Paperclip, Plus, Trash2, Globe, Clock, RefreshCw, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { StatusIndicator } from '../applications-detail/status-indicator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { applicationsService } from '@/services/applications-service';
import { DeleteApplicationDialog } from '@/components/applications-table/delete-application-dialog';
import { useRouter } from 'next/navigation';
import { JobApplication } from '@/types/database';
import { NotesList } from '@/components/notes/notes-list';

interface Application {
    id: string;
    user_id: string;
    company_name: string;
    position: string;
    status: 'pending' | 'interviewing' | 'offered' | 'planned' | 'rejected';
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

type DatabaseStatus = 'pending' | 'interview_stage' | 'offer_received' | 'planned' | 'rejected';

type UIStatus = 'pending' | 'interviewing' | 'offered' | 'planned' | 'rejected';

const mapUIStatusToDBStatus = (uiStatus: UIStatus): DatabaseStatus => {
    switch (uiStatus) {
        case 'offered':
            return 'offer_received';
        case 'interviewing':
            return 'interview_stage';
        default:
            return uiStatus as DatabaseStatus;
    }
};

const mapDBStatusToUIStatus = (dbStatus: string): UIStatus => {
    switch (dbStatus) {
        case 'offer_received':
            return 'offered';
        case 'interview_stage':
            return 'interviewing';
        default:
            return dbStatus as UIStatus;
    }
};

export function DetailPageComponent({ application }: { application: Application }) {
    const initialStatus = mapDBStatusToUIStatus(application.status);
    const [currentStatus, setCurrentStatus] = useState<UIStatus>(initialStatus);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const router = useRouter();

    const handleSetReminder = () => {
        console.log('Set reminder');
    };

    const handleDeleteApplication = async () => {
        try {
            await applicationsService.deleteApplication(application.id);
            router.push('/home');
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    const handleStatusChange = async (value: UIStatus) => {
        try {
            setIsUpdatingStatus(true);

            const dbStatus = mapUIStatusToDBStatus(value);

            setCurrentStatus(value);

            const result = await applicationsService.updateApplicationStatus(application.id, dbStatus);

            if (!result) {
                setCurrentStatus(initialStatus);
                toast.error('Failed to update status');
            } else {
                toast.success('Status updated successfully');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            setCurrentStatus(initialStatus);
            toast.error('Failed to update status');
        } finally {
            setIsUpdatingStatus(false);
        }
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
                                className="inline-flex items-center text-3xl font-semibold text-gray-900 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                                aria-label={`Visit ${application.company_name} website`}
                            >
                                {application.company_name}
                                <ExternalLink className="ml-2 h-4 w-4 mb-3 text-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                <span className="sr-only">Opens in a new tab</span>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/70 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                        <div className="flex items-center mb-2">
                            <Globe className="h-4 w-4 text-blue-500 mr-2" />
                            <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                                Source
                            </div>
                        </div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{application.source}</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/70 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                        <div className="flex items-center mb-2">
                            <CalendarIcon className="h-4 w-4 text-green-500 mr-2" />
                            <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                                Applied
                            </div>
                        </div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                            {format(new Date(application.application_date), 'MMM d, yyyy')}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/70 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                        <div className="flex items-center mb-2">
                            <RefreshCw className="h-4 w-4 text-purple-500 mr-2" />
                            <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                                Last Update
                            </div>
                        </div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                            {format(new Date(application.last_update), 'MMM d, yyyy')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section - Interview and Files */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                <NotesList applicationId={application.id} />
            </div>

            {/* Bottom Section - User Actions */}
            <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between rounded-bl-lg rounded-br-lg">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Status:</span>
                    <div className="relative">
                        <Select value={currentStatus} onValueChange={handleStatusChange} disabled={isUpdatingStatus}>
                            <SelectTrigger className={`w-[180px] ${isUpdatingStatus ? 'opacity-80' : ''}`}>
                                <SelectValue placeholder="Select status" />
                                {isUpdatingStatus && <Loader2 className="h-4 w-4 ml-2 animate-spin text-gray-500" />}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="interviewing">Interview</SelectItem>
                                <SelectItem value="offered">Offer</SelectItem>
                                <SelectItem value="planned">Planned</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DeleteApplicationDialog
                    job={application as unknown as JobApplication}
                    onDelete={handleDeleteApplication}
                >
                    <Button variant="destructive" className="hover:bg-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Application
                    </Button>
                </DeleteApplicationDialog>
            </div>
        </Card>
    );
}
