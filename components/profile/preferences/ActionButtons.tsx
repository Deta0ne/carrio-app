import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save, Loader2 } from 'lucide-react';

interface ActionButtonsProps {
    isEditMode: boolean;
    isLoading: boolean;
    isDirty: boolean;
    isValid: boolean;
    onEdit: () => void;
    onCancel: () => void;
}

const ActionButtons = memo(({ isEditMode, isLoading, isDirty, isValid, onEdit, onCancel }: ActionButtonsProps) => (
    <div className="flex justify-between items-center pt-2">
        {!isEditMode ? (
            <Button type="button" variant="outline" onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Preferences
            </Button>
        ) : (
            <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !isDirty || !isValid}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        )}
    </div>
));

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons;
