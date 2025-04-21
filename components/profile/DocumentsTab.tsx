'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, Loader2, File, Download, Trash2 } from 'lucide-react';
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

interface DocumentsTabProps {
    initialDocument: Document | null;
}

export function DocumentsTab({ initialDocument }: DocumentsTabProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [document, setDocument] = useState<Document | null>(initialDocument);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            await handleUpload(file);
        }
    };

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        setUploadProgress(0);

        try {
            // If there's an existing document, delete it first
            if (document) {
                await deleteDocument(document);
            }

            // Start progress animation
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => Math.min(prev + 5, 90));
            }, 100);

            const uploadedDocument = await uploadDocument(file);

            clearInterval(progressInterval);
            setUploadProgress(100);
            setDocument(uploadedDocument);

            toast.success('Document uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            setUploadError('Failed to upload document. Please try again.');
            toast.error('Failed to upload document');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!document) return;

        try {
            await deleteDocument(document);
            setDocument(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            toast.success('Document deleted successfully');
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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
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
            await handleUpload(file);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const formatFileSize = (bytes: number): string => {
        return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Card style={{ backgroundColor: 'transparent' }}>
            <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>Upload and manage your resume</CardDescription>
            </CardHeader>
            <CardContent>
                {uploadError && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{uploadError}</AlertDescription>
                    </Alert>
                )}

                {!document && !isUploading ? (
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
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileChange}
                        />

                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">Upload your CV/Resume</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Drag and drop your PDF file here, or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">Maximum file size: 5MB</p>
                            </div>
                        </div>
                    </div>
                ) : isUploading ? (
                    <div className="border-2 border-dashed rounded-lg p-6 text-center border-primary/30 bg-primary/10">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Uploading document...</h3>
                                <Progress value={uploadProgress} className="h-2 w-[250px]" />
                                <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
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
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={triggerFileInput}
                            variant="outline"
                            className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary/90"
                        >
                            <File className="mr-2 h-4 w-4" />
                            Replace Document
                        </Button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileChange}
                        />
                    </div>
                ) : null}

                <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Document Tips:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Keep your resume to 1-2 pages for best results</li>
                        <li>• Use a clean, professional format</li>
                        <li>• Highlight relevant skills and experience</li>
                        <li>• Update your resume regularly to reflect your latest achievements</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
