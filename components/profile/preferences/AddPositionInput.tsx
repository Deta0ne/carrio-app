import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface AddPositionInputProps {
    value: string;
    onChange: (value: string) => void;
    onAdd: () => void;
    disabled: boolean;
}

const AddPositionInput = memo(({ value, onChange, onAdd, disabled }: AddPositionInputProps) => (
    <div className="flex gap-2">
        <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Add a position"
            className="flex-1"
            maxLength={50}
        />
        <Button type="button" onClick={onAdd} variant="outline" disabled={disabled}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
        </Button>
    </div>
));

AddPositionInput.displayName = 'AddPositionInput';

export default AddPositionInput;
