'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter applications..."
                    value={(table.getColumn('company_name')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('company_name')?.setFilterValue(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
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
                {isFiltered && (
                    <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
