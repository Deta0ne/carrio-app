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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { JobApplication } from '@/types/database';
import { applicationsService } from '@/services/applications-service';
import { DeleteApplicationDialog } from '@/components/applications-table/index';
import { ApplicationDialog } from '@/components/applications/application-dialogs';

interface DataTableRowActionsProps {
    row: Row<JobApplication>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const application = row.original;
    const slug = generateSlug(application.position, application.company_name, application.id);

    const handleDelete = async () => {
        const success = await applicationsService.deleteApplication(row.original.id);
        if (success) {
            setDropdownOpen(false);
            router.refresh();
        }
    };

    return (
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
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
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
