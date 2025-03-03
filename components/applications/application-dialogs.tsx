import React from 'react';
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
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ApplicationForm } from '@/components/forms/application-form';
import { JobApplication } from '@/types/database';

interface ApplicationDialogProps {
    children: React.ReactNode;
    initialData?: JobApplication;
}

export function ApplicationDialog({ children, initialData }: ApplicationDialogProps) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{initialData ? 'Edit' : 'Create'} Application</DialogTitle>
                        <DialogDescription>
                            {initialData
                                ? 'Edit your application details.'
                                : 'Create a new application to track your job search.'}
                        </DialogDescription>
                    </DialogHeader>
                    <ApplicationForm initialData={initialData} onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{initialData ? 'Edit' : 'Create'} Application</DrawerTitle>
                    <DrawerDescription>
                        {initialData
                            ? 'Edit your application details.'
                            : 'Create a new application to track your job search.'}
                    </DrawerDescription>
                </DrawerHeader>
                <ApplicationForm initialData={initialData} className="px-4" onSuccess={() => setOpen(false)} />
            </DrawerContent>
        </Drawer>
    );
}
