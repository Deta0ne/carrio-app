'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, Loader2, File, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Document, uploadDocument, deleteDocument, downloadDocument } from '@/utils/supabase/documents';
import { profileService } from '@/services/profile-service';
import { useAuth } from '@/lib/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCategoryColorClass, getCategoryIcon } from '../hooks';
import { formatFileSize, formatDate, handleDragOver } from '../utils';
import { useRouter } from 'next/navigation';

interface CategorizedSkills {
    'Technical Skills': string[];
    'Soft Skills': string[];
    'Domain Knowledge': string[];
    Languages: string[];
    Education: string[];
    'Job Titles': string[];
    Responsibilities: string[];
    [key: string]: string[];
}

interface DocumentsTabProps {
    initialDocument: Document | null;
    initialCategorizedSkills?: CategorizedSkills | null;
    initialExtractedSkills?: string[] | null;
    initialIsSkillsSaved?: boolean;
    defaultActiveTab?: string;
}

export function DocumentsTab({
    initialDocument,
    initialCategorizedSkills = null,
    initialExtractedSkills = null,
    initialIsSkillsSaved = false,
    defaultActiveTab = 'document',
}: DocumentsTabProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [document, setDocument] = useState<Document | null>(initialDocument);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [parsedText, setParsedText] = useState<string | null>(null);
    const [extractedSkills, setExtractedSkills] = useState<string[] | null>(initialExtractedSkills);
    const [categorizedSkills, setCategorizedSkills] = useState<CategorizedSkills | null>(initialCategorizedSkills);
    const [isSkillsSaved, setIsSkillsSaved] = useState(initialIsSkillsSaved);
    const [activeTab, setActiveTab] = useState<string>(
        document
            ? defaultActiveTab === 'analysis'
                ? 'analysis'
                : 'document'
            : categorizedSkills
            ? 'analysis'
            : 'document',
    );
    const [processStatus, setProcessStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'saving' | 'complete'>(
        'idle',
    );
    const [processProgress, setProcessProgress] = useState(0);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (file.type !== 'application/pdf') {
                setUploadError('Only PDF files are supported');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setUploadError('File size must be less than 5MB');
                return;
            }

            setUploadError(null);
            await processCV(file);
        }
    };

    const processCV = async (file: File) => {
        setIsProcessing(true);
        setProcessStatus('uploading');
        setProcessProgress(0);
        setParsedText(null);
        setExtractedSkills(null);
        setCategorizedSkills(null);
        setIsSkillsSaved(false);

        try {
            // 1. Delete existing document (if exists)
            if (document) {
                await deleteDocument(document);
            }

            // Upload animation
            const processInterval = setInterval(() => {
                setProcessProgress((prev) => {
                    if (prev < 25) return prev + 1;
                    if (prev < 50 && processStatus === 'analyzing') return prev + 0.5;
                    if (prev < 90 && processStatus === 'saving') return prev + 0.2;
                    return prev;
                });
            }, 100);

            // 2. Upload CV
            toast.info('Uploading your CV...');
            const uploadedDocument = await uploadDocument(file);
            setDocument(uploadedDocument);
            setProcessStatus('analyzing');
            setProcessProgress(25);
            toast.info('CV uploaded, analyzing content...');

            // 3. Download and analyze PDF content
            const pdfUrl = await downloadDocument(uploadedDocument);

            // 4. Extract text from PDF
            const formData = new FormData();
            const pdfResponse = await fetch(pdfUrl);
            const pdfBlob = await pdfResponse.blob();
            formData.append('file', pdfBlob, uploadedDocument.name);

            const extractResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!extractResponse.ok) {
                throw new Error('Failed to extract text from CV');
            }

            const extractData = await extractResponse.json();
            setParsedText(extractData.parsedText);
            setProcessProgress(50);

            // 5. Extract skills from parsed text
            const skillsResponse = await fetch('/api/extract-skills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: extractData.parsedText }),
            });

            if (!skillsResponse.ok) {
                throw new Error('Failed to analyze CV content');
            }

            const skillsData = await skillsResponse.json();
            setExtractedSkills(skillsData.skills);
            setCategorizedSkills(skillsData.categorized_skills);
            setProcessStatus('saving');
            setProcessProgress(75);
            toast.info('Skills extracted, saving to your profile...');

            // 6. Save skills to profile
            if (user?.id) {
                const result = await profileService.saveProfileSkills(
                    user.id,
                    skillsData.skills,
                    skillsData.categorized_skills,
                );

                if (!result.success) {
                    throw new Error('Failed to save skills to profile');
                }

                setIsSkillsSaved(true);
            }

            // 7. Process completed
            clearInterval(processInterval);
            setProcessProgress(100);
            setProcessStatus('complete');
            setActiveTab('analysis');
            toast.success('CV processed and skills saved successfully!');
            router.refresh();
            setTimeout(() => {
                setIsProcessing(false);
            }, 500);
        } catch (error) {
            console.error('CV processing error:', error);
            toast.error('Failed to process CV. Please try again.');
            setUploadError('Failed to process CV. Please try again.');
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!document) return;

        try {
            await deleteDocument(document);
            setDocument(null);
            setParsedText(null);
            setExtractedSkills(null);
            setCategorizedSkills(null);
            setIsSkillsSaved(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            toast.success('Document deleted successfully');
            router.refresh();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete document');
        }
    };

    const handleDownload = async () => {
        if (!document) return;

        try {
            const url = await downloadDocument(document);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download document');
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];

            if (file.type !== 'application/pdf') {
                setUploadError('Only PDF files are supported');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setUploadError('File size must be less than 5MB');
                return;
            }

            setUploadError(null);
            await processCV(file);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const getProcessStatusMessage = () => {
        switch (processStatus) {
            case 'uploading':
                return 'Uploading your CV...';
            case 'analyzing':
                return 'Analyzing CV content...';
            case 'saving':
                return 'Saving skills to your profile...';
            case 'complete':
                return 'Processing complete!';
            default:
                return '';
        }
    };

    return (
        <Card style={{ backgroundColor: 'transparent' }}>
            <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>Upload your resume for automatic analysis</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Hidden file input - always available in the DOM */}
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileChange} />

                {uploadError && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{uploadError}</AlertDescription>
                    </Alert>
                )}

                {isLoadingProfile ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                        <p>Loading your profile data...</p>
                    </div>
                ) : !document && !isProcessing && !categorizedSkills ? (
                    <div
                        className={`
                            border-2 border-dashed rounded-lg p-6 text-center
                            border-border hover:border-primary/30 hover:bg-primary/10
                            transition-colors duration-200 cursor-pointer
                        `}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={triggerFileInput}
                    >
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">Upload your CV/Resume</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Drag and drop your PDF file here, or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Your CV will be automatically analyzed and skills saved to your profile
                                </p>
                            </div>
                        </div>
                    </div>
                ) : isProcessing ? (
                    <div className="border-2 border-dashed rounded-lg p-6 text-center border-primary/30 bg-primary/10">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">{getProcessStatusMessage()}</h3>
                                <Progress value={processProgress} className="h-2 w-[250px]" />
                                <p className="text-sm text-muted-foreground">{Math.round(processProgress)}% complete</p>
                            </div>
                        </div>
                    </div>
                ) : document ? (
                    <div className="space-y-4">
                        <div className="flex items-start space-x-4 p-4 border rounded-lg bg-muted/30">
                            <div className="rounded-full bg-primary/10 p-2 flex-shrink-0">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium truncate">{document.name}</h3>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                            onClick={handleDownload}
                                        >
                                            <Download className="h-4 w-4" />
                                            <span className="sr-only">Download</span>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Document</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete this document? This action
                                                        cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={handleDelete}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>

                                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                                    <span>{document.type}</span>
                                    <span className="mx-2">•</span>
                                    <span>{formatFileSize(document.size)}</span>
                                    <span className="mx-2">•</span>
                                    <span>Uploaded on {formatDate(document.created_at)}</span>
                                    {isSkillsSaved && (
                                        <>
                                            <span className="mx-2">•</span>
                                            <span className="flex items-center text-green-600">
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Skills saved
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            <Button
                                onClick={triggerFileInput}
                                variant="outline"
                                className="flex-1 border-primary text-primary hover:bg-primary/10 hover:text-primary/90"
                            >
                                <File className="mr-2 h-4 w-4" />
                                Replace Document
                            </Button>
                        </div>
                    </div>
                ) : null}

                {/* Mevcut CV ve beceri bilgisi yoksa ve profile'da skills varsa, bu bölüm gösterilir */}
                {!document && !isProcessing && categorizedSkills && (
                    <div className="mb-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium">Profile Skills</h3>
                            <div className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Saved to your profile
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            These skills are already saved to your profile from your previous CV upload.
                        </p>
                        <Button onClick={triggerFileInput} className="w-full">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload New CV
                        </Button>
                    </div>
                )}

                {(categorizedSkills || document) && (
                    <div className="mt-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid grid-cols-2 mb-4">
                                <TabsTrigger value="document">Document</TabsTrigger>
                                <TabsTrigger value="analysis">Analysis Results</TabsTrigger>
                            </TabsList>

                            <TabsContent value="document">
                                <div className="mt-2">
                                    <h3 className="text-sm font-medium mb-2">Document Tips:</h3>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Keep your resume to 1-2 pages for best results</li>
                                        <li>• Use a clean, professional format</li>
                                        <li>• Highlight relevant skills and experience</li>
                                        <li>• Update your resume regularly to reflect your latest achievements</li>
                                    </ul>
                                </div>
                            </TabsContent>

                            <TabsContent value="analysis">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">Extracted Skills</h3>

                                        <div className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Saved to your profile
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        {categorizedSkills &&
                                            Object.entries(categorizedSkills).map(
                                                ([category, skills]) =>
                                                    skills.length > 0 && (
                                                        <div
                                                            key={category}
                                                            className="p-4 rounded-lg border bg-card shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900/40"
                                                        >
                                                            <div className="flex items-center mb-3">
                                                                {getCategoryIcon(category)}
                                                                <h4 className="text-md font-semibold ml-2">
                                                                    {category}
                                                                </h4>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {skills.map((skill, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColorClass(
                                                                            category,
                                                                        )}`}
                                                                    >
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ),
                                            )}
                                    </div>

                                    <div className=" border border-blue-800/50 p-4 rounded-lg mt-6 dark:bg-blue-900/10 dark:border-blue-800/30">
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 mt-1">
                                                <svg
                                                    className="h-5 w-5 text-blue-400 dark:text-blue-300"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.75.75 0 00.736-.602A1.75 1.75 0 019 9.75V9zm1 5a1 1 0 100-2 1 1 0 000 2z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-semibold text-blue-400 dark:text-blue-300 mb-1">
                                                    How are these skills used?
                                                </h5>
                                                <p className="text-sm text-blue-300 dark:text-blue-400/80">
                                                    These skills have been automatically extracted from your CV and
                                                    saved to your profile. Our job matching algorithm will use them to
                                                    find opportunities that match your expertise.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-lg border bg-card flex items-center dark:border-gray-700 dark:bg-gray-900/40">
                                            <div className="mr-3 p-2 rounded-full bg-purple-950/30 dark:bg-purple-900/20">
                                                <svg
                                                    className="h-5 w-5 text-purple-400 dark:text-purple-300"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-semibold">Job Matching</h5>
                                                <p className="text-xs text-muted-foreground">
                                                    Find jobs that match your skills
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-lg border bg-card flex items-center dark:border-gray-700 dark:bg-gray-900/40">
                                            <div className="mr-3 p-2 rounded-full bg-blue-950/30 dark:bg-blue-900/20">
                                                <svg
                                                    className="h-5 w-5 text-blue-400 dark:text-blue-300"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-semibold">Skill Suggestions</h5>
                                                <p className="text-xs text-muted-foreground">
                                                    Improve your job matches
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}

                {!document && !isProcessing && !categorizedSkills && (
                    <div className="mt-6">
                        <h3 className="text-sm font-medium mb-2">Document Tips:</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Keep your resume to 1-2 pages for best results</li>
                            <li>• Use a clean, professional format</li>
                            <li>• Highlight relevant skills and experience</li>
                            <li>• Update your resume regularly to reflect your latest achievements</li>
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
