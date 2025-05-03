export const formatFileSize = (bytes: number): string => {
    return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
};

export const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
};