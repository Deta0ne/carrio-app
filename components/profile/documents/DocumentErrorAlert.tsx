import { Alert, AlertDescription } from '@/components/ui/alert';

interface DocumentErrorAlertProps {
    message: string;
}

export function DocumentErrorAlert({ message }: DocumentErrorAlertProps) {
    return (
        <Alert variant="destructive" className="mb-4">
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
