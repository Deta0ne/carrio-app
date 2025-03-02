'use client';

import { Table } from '@tanstack/react-table';
import { X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions, DataTableFacetedFilter } from '@/components/applications-table/index';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { applicationsService } from '@/services/applications-service';

interface DataTableToolbarProps<TData extends { id: string }> {
    table: Table<TData>;
}

export function DataTableToolbar<TData extends { id: string }>({ table }: DataTableToolbarProps<TData>) {
    const router = useRouter();
    const selectedRows = table.getSelectedRowModel().rows;
    const isFiltered = table.getState().columnFilters.length > 0;

    const handleBulkDelete = async () => {
        const ids = selectedRows.map((row) => row.original.id);
        const success = await applicationsService.deleteMultipleApplications(ids);
        if (success) {
            table.toggleAllRowsSelected(false);
            router.refresh();
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2 flex-col md:flex-row space-y-2 md:space-y-0">
                <Input
                    placeholder="Filter applications..."
                    value={(table.getColumn('company_name')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('company_name')?.setFilterValue(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                <div className=" gap-2 flex flex-row">
                    {table.getColumn('status') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('status')}
                            title="Status"
                            options={[
                                { value: 'pending', label: 'Pending' },
                                { value: 'interview_stage', label: 'Interview' },
                                { value: 'offer_received', label: 'Offer' },
                                { value: 'rejected', label: 'Rejected' },
                                { value: 'planned', label: 'Planned' },
                            ]}
                        />
                    )}
                    {table.getColumn('source') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('source')}
                            title="Source"
                            options={[
                                { value: 'LinkedIn', label: 'LinkedIn' },
                                { value: 'Company Website', label: 'Company Website' },
                                { value: 'Indeed', label: 'Indeed' },
                                { value: 'GitHub Jobs', label: 'GitHub Jobs' },
                                { value: 'Career Website', label: 'Career Website' },
                                { value: 'Other', label: 'Other' },
                            ]}
                        />
                    )}
                </div>
                {isFiltered && (
                    <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
                {selectedRows.length > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="h-8">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Selected ({selectedRows.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete {selectedRows.length} selected applications. This
                                    action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleBulkDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
