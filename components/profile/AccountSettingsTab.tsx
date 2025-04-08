import { ChangePasswordCard } from './settings/ChangePasswordCard';
import { PreferencesCard } from './settings/PreferencesCard';

export function AccountSettingsTab() {
    return (
        <div className="space-y-6">
            <ChangePasswordCard />
            <PreferencesCard />
        </div>
    );
}
