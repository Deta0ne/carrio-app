'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { statuses } from '../data/data';
import { JobApplication, jobApplicationSchema } from '../data/schema';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

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
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
        cell: ({ row }) => <div className="w-[50px]">{row.getValue('id')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'companyName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Company" />,
        cell: ({ row }) => <span className="font-medium">{row.getValue('companyName')}</span>,
    },
    {
        accessorKey: 'position',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Position" />,
        cell: ({ row }) => <span>{row.getValue('position')}</span>,
    },
    {
        accessorKey: 'applicationDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Applied On" />,
        cell: ({ row }) => <span>{row.getValue('applicationDate')}</span>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = statuses.find((status) => status.value === row.getValue('status'));

            if (!status) {
                return null;
            }

            return (
                <div className="flex w-[120px] items-center">
                    {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span>{status.label}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: 'lastUpdate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Last Update" />,
        cell: ({ row }) => <span>{row.getValue('lastUpdate')}</span>,
    },
    {
        accessorKey: 'interviewDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Interview Date" />,
        cell: ({ row }) => {
            const date = row.getValue('interviewDate') as string | null;
            return date ? <span>{date}</span> : <span className="text-muted">Not Scheduled</span>;
        },
    },
    {
        accessorKey: 'source',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Source" />,
        cell: ({ row }) => {
            return <Badge variant="outline">{row.getValue('source')}</Badge>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
