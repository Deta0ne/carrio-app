'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, Loader2, File, Download, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MockDataIndicator from '@/components/profile/preferences/MockDataIndicator';

export function DocumentsTab() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [document, setDocument] = useState<{
        name: string;
        size: string;
        type: string;
        date: string;
    } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            simulateUpload(file);
        }
    };

    const simulateUpload = (file: File) => {
        setIsUploading(true);
        setUploadProgress(0);

        setDocument(null);

        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);

                    const size =
                        file.size < 1024 * 1024
                            ? `${(file.size / 1024).toFixed(1)} KB`
                            : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

                    setDocument({
                        name: file.name,
                        size: size,
                        type: 'Resume/CV',
                        date: new Date().toLocaleDateString(),
                    });

                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
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
            simulateUpload(file);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleDelete = () => {
        setDocument(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Card style={{ backgroundColor: 'transparent' }}>
            <CardHeader className="relative">
                <MockDataIndicator />
                <CardTitle>Document Management</CardTitle>
                <CardDescription>Upload and manage your resume and other documents</CardDescription>
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
                                        >
                                            <Download className="h-4 w-4" />
                                            <span className="sr-only">Download</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                            onClick={handleDelete}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                                    <span>{document.type}</span>
                                    <span className="mx-2">•</span>
                                    <span>{document.size}</span>
                                    <span className="mx-2">•</span>
                                    <span>Uploaded on {document.date}</span>
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
