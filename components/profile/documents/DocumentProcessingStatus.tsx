import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DocumentProcessingStatusProps {
    status: 'idle' | 'uploading' | 'analyzing' | 'saving' | 'complete';
    progress: number;
}

export function DocumentProcessingStatus({ status, progress }: DocumentProcessingStatusProps) {
    const getProcessStatusMessage = () => {
        switch (status) {
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
        <div className="border-2 border-dashed rounded-lg p-6 text-center border-primary/30 bg-primary/10">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-primary/10 p-3">
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">{getProcessStatusMessage()}</h3>
                    <Progress value={progress} className="h-2 w-[250px]" />
                    <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
                </div>
            </div>
        </div>
    );
}
