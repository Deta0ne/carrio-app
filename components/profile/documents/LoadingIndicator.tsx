interface LoadingIndicatorProps {
    message: string;
}

export function LoadingIndicator({ message }: LoadingIndicatorProps) {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
            <p>{message}</p>
        </div>
    );
}
