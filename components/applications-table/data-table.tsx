'use client';

import * as React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination, DataTableToolbar } from '@/components/applications-table/index';
import { useMediaQuery } from '@/hooks/use-media-query';
import JobCard from '@/components/ApplicationCard';
import { JobApplication } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData extends { id: string }, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading: boolean;
}

export function DataTable<TData extends { id: string }, TValue>({
    columns,
    data,
    isLoading,
}: DataTableProps<TData, TValue>) {
    const [isMounted, setIsMounted] = React.useState(false);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    if (!isMounted) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between gap-2">
                    <Skeleton className="h-8 w-96" />
                    <Skeleton className="h-8 w-20" />
                </div>
                <div className="overflow-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableHead key={`skeleton-header-${index}`} className="whitespace-nowrap">
                                        <Skeleton className="h-4 w-full" />
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, rowIndex) => (
                                <TableRow key={`skeleton-row-${rowIndex}`}>
                                    {columns.map((column, colIndex) => (
                                        <TableCell
                                            key={`skeleton-cell-${rowIndex}-${colIndex}`}
                                            className="whitespace-nowrap"
                                        >
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-between gap-2">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-8 w-96" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <DataTableToolbar table={table} />
            {isDesktop ? (
                <>
                    <div className="overflow-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    className="whitespace-nowrap"
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column.columnDef.header,
                                                              header.getContext(),
                                                          )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            {columns.map((column) => (
                                                <TableCell key={column.id} className="whitespace-nowrap">
                                                    <Skeleton className="h-4 w-full" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="whitespace-nowrap">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No job applications found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <DataTablePagination table={table} />
                </>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-24 w-full" />)
                        : table.getRowModel().rows.map((row) => {
                              const application = row.original as unknown as JobApplication;
                              return <JobCard key={application.id} job={application} />;
                          })}
                </div>
            )}
        </div>
    );
}
