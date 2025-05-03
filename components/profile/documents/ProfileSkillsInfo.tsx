import { Button } from '@/components/ui/button';
import { Upload, CheckCircle2 } from 'lucide-react';
import { useRef } from 'react';

interface ProfileSkillsInfoProps {
    onUploadNew: (file: File) => Promise<void>;
}

export function ProfileSkillsInfo({ onUploadNew }: ProfileSkillsInfoProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await onUploadNew(e.target.files[0]);
        }
    };

    return (
        <div className="mb-4 p-4 border rounded-lg">
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileChange} />
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
    );
}
