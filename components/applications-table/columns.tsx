'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { format } from 'date-fns';
import { JobApplication } from '@/types/database';
export const columns: ColumnDef<JobApplication>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'company_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Company" />,
        cell: ({ row }) => <span className="font-medium">{row.getValue('company_name')}</span>,
    },
    {
        accessorKey: 'position',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Position" />,
        cell: ({ row }) => <span>{row.getValue('position')}</span>,
    },
    {
        accessorKey: 'application_date',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Applied On" />,
        cell: ({ row }) => {
            const date = row.getValue('application_date') as string;
            return <span>{format(new Date(date), 'PP')}</span>;
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <div className="flex w-[100px] items-center">
                    {status === 'planned' && <Badge variant="secondary">Planned</Badge>}
                    {status === 'pending' && <Badge variant="outline">Pending</Badge>}
                    {status === 'interview_stage' && <Badge variant="default">Interview</Badge>}
                    {status === 'offer_received' && <Badge variant="secondary">Offer</Badge>}
                    {status === 'rejected' && <Badge variant="destructive">Rejected</Badge>}
                </div>
            );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: 'last_update',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Last Update" />,
        cell: ({ row }) => {
            const date = row.getValue('last_update') as string | null;
            return date ? <span>{format(new Date(date), 'PP')}</span> : null;
        },
    },
    {
        accessorKey: 'interview_date',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Interview Date" />,
        cell: ({ row }) => {
            const date = row.getValue('interview_date') as string | null;
            return date ? (
                <span>{format(new Date(date), 'PP')}</span>
            ) : (
                <span className="text-muted-foreground">Not Scheduled</span>
            );
        },
    },
    {
        accessorKey: 'source',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Source" />,
        cell: ({ row }) => {
            return <Badge variant="outline">{row.getValue('source')}</Badge>;
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
