'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { preferencesFormSchema, type PreferencesFormValues, mockPreferences } from '@/lib/validations/preferences';
import MockDataIndicator from './preferences/MockDataIndicator';
import PositionBadge from './preferences/PositionBadge';
import AddPositionInput from './preferences/AddPositionInput';
import ActionButtons from './preferences/ActionButtons';

export const PreferencesTab = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [newPosition, setNewPosition] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<PreferencesFormValues>({
        resolver: zodResolver(preferencesFormSchema),
        defaultValues: mockPreferences,
        mode: 'onChange',
    });

    const handleAddPosition = useCallback(() => {
        const currentPositions = form.getValues('positions');
        const trimmedPosition = newPosition.trim();

        if (trimmedPosition && currentPositions.length < 5) {
            const isDuplicate = currentPositions.some((pos) => pos.toLowerCase() === trimmedPosition.toLowerCase());

            if (isDuplicate) {
                toast.error('This position is already added');
                return;
            }

            form.setValue('positions', [...currentPositions, trimmedPosition], {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            });
            setNewPosition('');
        }
    }, [form, newPosition]);

    const handleRemovePosition = useCallback(
        (position: string) => {
            const currentPositions = form.getValues('positions');
            form.setValue(
                'positions',
                currentPositions.filter((p) => p !== position),
                {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                },
            );
        },
        [form],
    );

    const handleEdit = useCallback(() => {
        form.reset(form.getValues());
        setIsEditMode(true);
    }, [form]);

    const handleCancel = useCallback(() => {
        form.reset();
        setIsEditMode(false);
        setNewPosition('');
    }, [form]);

    const onSubmit = useCallback(async (values: PreferencesFormValues) => {
        setIsLoading(true);
        try {
            // TODO: Implement actual API call
            console.log('Form values:', values);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Preferences updated successfully');
            setIsEditMode(false);
        } catch (error) {
            console.error('Error updating preferences:', error);
            toast.error('Failed to update preferences', {
                description: 'Please try again later',
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <Card>
            <CardHeader className="relative">
                <MockDataIndicator />
                <CardTitle>Job Search Preferences</CardTitle>
                <CardDescription>Customize your job search criteria to find the perfect match</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="positions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Positions</FormLabel>
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {field.value.map((position) => (
                                                <PositionBadge
                                                    key={position}
                                                    position={position}
                                                    isEditMode={isEditMode}
                                                    onRemove={handleRemovePosition}
                                                />
                                            ))}
                                        </div>
                                        {isEditMode && (
                                            <AddPositionInput
                                                value={newPosition}
                                                onChange={setNewPosition}
                                                onAdd={handleAddPosition}
                                                disabled={!newPosition.trim() || field.value.length >= 5}
                                            />
                                        )}
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="workArrangement"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>Preferred Work Arrangement</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                                            disabled={!isEditMode}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="remote" id="remote" />
                                                <Label htmlFor="remote" className="cursor-pointer">
                                                    Remote
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="hybrid" id="hybrid" />
                                                <Label htmlFor="hybrid" className="cursor-pointer">
                                                    Hybrid
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="onsite" id="onsite" />
                                                <Label htmlFor="onsite" className="cursor-pointer">
                                                    On-site
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preferred Location</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="City, State or Remote"
                                            readOnly={!isEditMode}
                                            className={!isEditMode ? 'bg-muted' : ''}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <ActionButtons
                            isEditMode={isEditMode}
                            isLoading={isLoading}
                            isDirty={form.formState.isDirty}
                            isValid={form.formState.isValid}
                            onEdit={handleEdit}
                            onCancel={handleCancel}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
