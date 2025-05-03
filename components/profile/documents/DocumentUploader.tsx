import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { handleDragOver } from '../utils';

interface DocumentUploaderProps {
    onUpload: (file: File) => Promise<void>;
}

export function DocumentUploader({ onUpload }: DocumentUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await onUpload(e.dataTransfer.files[0]);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await onUpload(e.target.files[0]);
        }
    };

    return (
        <>
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileChange} />
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
        </>
    );
}
