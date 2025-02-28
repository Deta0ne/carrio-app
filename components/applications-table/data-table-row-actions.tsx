'use client';

import { MoreHorizontal } from 'lucide-react';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pencil, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { JobApplication } from '@/types/database';
import { applicationsService } from '@/services/applications-service';
import { DeleteApplicationDialog } from '@/components/applications-table/delete-application-dialog';

interface DataTableRowActionsProps {
    row: Row<JobApplication>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
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
