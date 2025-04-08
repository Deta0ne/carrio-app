'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import MockDataIndicator from '../preferences/MockDataIndicator';

interface NotificationSettings {
    emailAlerts: boolean;
    jobMatches: boolean;
    applicationUpdates: boolean;
    marketingEmails: boolean;
}

export const PreferencesCard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('dark');
    const [notifications, setNotifications] = useState<NotificationSettings>({
        emailAlerts: true,
        jobMatches: true,
        applicationUpdates: true,
        marketingEmails: false,
    });

    const handleThemeToggle = useCallback(() => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setCurrentTheme(newTheme);
    }, [currentTheme]);

    const handleNotificationChange = useCallback(
        (key: keyof NotificationSettings) => {
            setIsLoading(true);
            const newValue = !notifications[key];

            setTimeout(() => {
                setNotifications((prev) => ({
                    ...prev,
                    [key]: newValue,
                }));
                setIsLoading(false);
                toast.success('Preferences updated');
            }, 0);
        },
        [notifications],
    );

    return (
        <Card style={{ backgroundColor: 'transparent' }}>
            <CardHeader className="relative">
                <MockDataIndicator />
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Manage your theme and notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="theme-toggle">Theme</Label>
                            <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Sun className="h-4 w-4" />
                            <Switch
                                id="theme-toggle"
                                checked={currentTheme === 'dark'}
                                onCheckedChange={handleThemeToggle}
                            />
                            <Moon className="h-4 w-4" />
                        </div>
                    </div>

                    <div className="h-px bg-border" />

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Notification Preferences</h3>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-alerts">Email Alerts</Label>
                                <p className="text-sm text-muted-foreground">Receive important account notifications</p>
                            </div>
                            <Switch
                                id="email-alerts"
                                checked={notifications.emailAlerts}
                                onCheckedChange={() => handleNotificationChange('emailAlerts')}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="job-matches">Job Matches</Label>
                                <p className="text-sm text-muted-foreground">Get notified about new job matches</p>
                            </div>
                            <Switch
                                id="job-matches"
                                checked={notifications.jobMatches}
                                onCheckedChange={() => handleNotificationChange('jobMatches')}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="application-updates">Application Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive updates on your job applications
                                </p>
                            </div>
                            <Switch
                                id="application-updates"
                                checked={notifications.applicationUpdates}
                                onCheckedChange={() => handleNotificationChange('applicationUpdates')}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                                <p className="text-sm text-muted-foreground">Receive promotional emails and offers</p>
                            </div>
                            <Switch
                                id="marketing-emails"
                                checked={notifications.marketingEmails}
                                onCheckedChange={() => handleNotificationChange('marketingEmails')}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
