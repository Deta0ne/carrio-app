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
import { applicationsService } from '@/services/applications-service';
import { JobApplication } from '@/types/database';

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
                <Button>Create</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Create Application</DrawerTitle>
                    <DrawerDescription>Create a new application to track your job search.</DrawerDescription>
                </DrawerHeader>
                <ApplicationForm className="px-4" onSuccess={() => setOpen(false)} />
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

interface ApplicationFormProps {
    initialData?: JobApplication;
    className?: string;
    onSuccess?: () => void;
}

function mapJobToFormValues(job: JobApplication): ApplicationFormValues {
    return {
        company_name: job.company_name,
        position: job.position,
        status: job.status,
        application_date: new Date(job.application_date),
        interview_date: job.interview_date ? new Date(job.interview_date) : null,
        source: job.source as ApplicationFormValues['source'],
        company_website: job.company_website || '',
    };
}

function ApplicationForm({ initialData, className, onSuccess }: ApplicationFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<ApplicationFormValues>({
        resolver: zodResolver(applicationFormSchema),
        defaultValues: initialData
            ? mapJobToFormValues(initialData)
            : {
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
            const success = initialData
                ? await applicationsService.updateApplication(initialData.id, values)
                : await applicationsService.createApplication(values);

            if (success) {
                form.reset();
                router.refresh();
                onSuccess?.();
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn('grid gap-6', className)}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 gap-4 max-h-[80vh] md:max-h-none overflow-y-auto overscroll-contain"
                >
                    <div className="space-y-4 touch-manipulation">
                        <FormField
                            name="company_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="Enter company name"
                                                maxLength={35}
                                                className="focus:scroll-m-0"
                                                {...field}
                                            />
                                            <span className="absolute right-2 top-2 text-xs text-muted-foreground">
                                                {field.value.length}/35
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
                                            <Input
                                                placeholder="Enter position title"
                                                maxLength={35}
                                                className="focus:scroll-m-0"
                                                {...field}
                                            />
                                            <span className="absolute right-2 top-2 text-xs text-muted-foreground">
                                                {field.value.length}/35
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4 touch-manipulation">
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
                                            <SelectItem value="draft">Draft</SelectItem>
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
                            name="application_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Application Date</FormLabel>
                                    <Popover modal={true}>
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
                                        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => {
                                                    const status = form.getValues('status');
                                                    if (status === 'planned') {
                                                        return date < new Date(new Date().setHours(0, 0, 0, 0));
                                                    }
                                                    return date > new Date(new Date().setHours(23, 59, 59, 999));
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="source"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Application Source</FormLabel>
                                    <div className=" md:hidden">
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select source" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {sourceOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div className="hidden md:block">
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
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="interview_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Interview Date (Optional)</FormLabel>
                                    <Popover modal={true}>
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
                                        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
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
                                        <Input placeholder="https://..." className="focus:scroll-m-0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full mb-2" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : initialData ? 'Update Application' : 'Create Application'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export { ApplicationForm };
