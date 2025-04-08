import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface PositionBadgeProps {
    position: string;
    isEditMode: boolean;
    onRemove: (position: string) => void;
}

const PositionBadge = memo(({ position, isEditMode, onRemove }: PositionBadgeProps) => (
    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
        {position}
        {isEditMode && (
            <button type="button" onClick={() => onRemove(position)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {position}</span>
            </button>
        )}
    </Badge>
));

PositionBadge.displayName = 'PositionBadge';

export default PositionBadge;
