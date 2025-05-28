import { FileText, Download, Trash2, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize, formatDate } from '../utils';
import { CheckCircle2 } from 'lucide-react';
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
import { Document } from '@/services/documents';
import { useRef } from 'react';

interface DocumentViewerProps {
    document: Document;
    isSkillsSaved: boolean;
    onDelete: () => Promise<void>;
    onDownload: () => Promise<void>;
    onReplace: (file: File) => Promise<void>;
}

export function DocumentViewer({ document, isSkillsSaved, onDelete, onDownload, onReplace }: DocumentViewerProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await onReplace(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-4 w-full">
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileChange} />
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 p-4 border rounded-lg bg-muted/30">
                <div className="rounded-full bg-primary/10 p-2 flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                        <h3 className="font-medium truncate max-w-[200px] sm:max-w-[300px]">{document.name}</h3>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                onClick={onDownload}
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
                                            Are you sure you want to delete this document? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={onDelete}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{document.type}</span>
                        <span>{formatFileSize(document.size)}</span>
                        <span>Uploaded on {formatDate(document.created_at)}</span>
                        {isSkillsSaved && (
                            <>
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
                    className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 hover:text-primary/90"
                >
                    <File className="mr-2 h-4 w-4" />
                    Replace Document
                </Button>
            </div>
        </div>
    );
}
