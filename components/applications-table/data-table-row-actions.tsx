'use client';

import { MoreHorizontal, Eye, Pencil, Trash } from 'lucide-react';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { generateSlug } from '@/utils/slugify';
import { useState } from 'react';
import { JobApplication } from '@/types/database';
import { applicationsService } from '@/services/applications-service';
import { DeleteApplicationDialog } from '@/components/applications-table/index';
import { ApplicationDialog } from '@/components/applications/application-dialogs';
import { toast } from 'sonner';

interface DataTableRowActionsProps {
    row: Row<JobApplication>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const application = row.original;
    const slug = generateSlug(application.position, application.company_name, application.id);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            const success = await applicationsService.deleteApplication(row.original.id);

            if (success) {
                setDropdownOpen(false);
                window.location.reload();
            } else {
                throw new Error('Failed to delete application');
            }
        } catch (error) {
            console.error('Error deleting application:', error);
            toast.error('Failed to delete application', {
                description: 'Please try again later',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted" disabled={isLoading}>
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <Link href={`/home/${slug}`} className="w-full">
                    <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <ApplicationDialog initialData={application}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                </ApplicationDialog>
                <DropdownMenuSeparator />
                <DeleteApplicationDialog job={row.original} onDelete={handleDelete}>
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        disabled={isLoading}
                        className={isLoading ? 'cursor-not-allowed opacity-50' : ''}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        <span className="text-destructive">Delete</span>
                    </DropdownMenuItem>
                </DeleteApplicationDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function CreateApplicationButton() {
    return (
        <ApplicationDialog>
            <Button>Create Application</Button>
        </ApplicationDialog>
    );
}
