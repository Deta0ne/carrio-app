'use client';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { applicationFormSchema, ApplicationFormValues } from '@/lib/validations/application';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';

export function ApplicationCreate() {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>Create Application</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Application</DialogTitle>
                        <DialogDescription>Create a new application to track your job search.</DialogDescription>
                    </DialogHeader>
                    <ApplicationForm onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">Create Application</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Create Application</DrawerTitle>
                    <DrawerDescription>Create a new application to track your job search.</DrawerDescription>
                </DrawerHeader>
                <ApplicationForm className="px-4" onSuccess={() => setOpen(false)} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

const sourceOptions = [
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Company Website', label: 'Company Website' },
    { value: 'Indeed', label: 'Indeed' },
    { value: 'GitHub Jobs', label: 'GitHub Jobs' },
    { value: 'Career Website', label: 'Career Website' },
    { value: 'Other', label: 'Other' },
];

function ApplicationForm({ className, onSuccess }: { className?: string; onSuccess?: () => void }) {
    const supabase = createClient();
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<ApplicationFormValues>({
        resolver: zodResolver(applicationFormSchema),
        defaultValues: {
            company_name: '',
            position: '',
            status: 'pending',
            application_date: new Date(),
            interview_date: null,
            source: 'LinkedIn',
            company_website: '',
        },
    });

    async function onSubmit(values: ApplicationFormValues) {
        setIsLoading(true);
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const applicationDate = new Date(values.application_date);
            const applicationDateUTC = new Date(
                applicationDate.getTime() - applicationDate.getTimezoneOffset() * 60000,
            );

            const interviewDate = values.interview_date
                ? new Date(values.interview_date.getTime() - values.interview_date.getTimezoneOffset() * 60000)
                : null;

            const { error } = await supabase.from('job_applications').insert({
                user_id: user.id,
                company_name: values.company_name,
                position: values.position,
                status: values.status,
                application_date: applicationDateUTC.toISOString().split('T')[0],
                interview_date: interviewDate?.toISOString().split('T')[0] || null,
                source: values.source,
                company_website: values.company_website || null,
            });

            if (error) throw error;

            toast.success('Application created successfully', {
                description: `${values.position} at ${values.company_name}`,
            });
            form.reset();
            router.refresh();
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast.error('Failed to create application', {
                description: 'Please try again later.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn('grid gap-6', className)}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
                    <div className="space-y-4">
                        <FormField
                            name="company_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="Enter company name" maxLength={100} {...field} />
                                            <span className="absolute right-2 top-2 text-xs text-muted-foreground">
                                                {field.value.length}/100
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Position</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="Enter position title" maxLength={150} {...field} />
                                            <span className="absolute right-2 top-2 text-xs text-muted-foreground">
                                                {field.value.length}/150
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="application_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Application Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                        !field.value && 'text-muted-foreground',
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, 'PPP')
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <FormField
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Application Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="interview_stage">Interview</SelectItem>
                                            <SelectItem value="offer_received">Offer</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                            <SelectItem value="planned">Planned</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="source"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Application Source</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-wrap gap-2">
                                            {sourceOptions.map((option) => (
                                                <Badge
                                                    key={option.value}
                                                    variant={field.value === option.value ? 'default' : 'outline'}
                                                    className="cursor-pointer hover:bg-primary/80"
                                                    onClick={() => field.onChange(option.value)}
                                                >
                                                    {option.label}
                                                </Badge>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="interview_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Interview Date (Optional)</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                        !field.value && 'text-muted-foreground',
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, 'PPP')
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="company_website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Website (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export { ApplicationForm };
