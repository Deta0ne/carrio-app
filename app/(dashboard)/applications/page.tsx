import { promises as fs } from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { z } from 'zod';

import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { UserNav } from './components/user-nav';
import { jobApplicationSchema } from './data/schema';
import { DrawerDialogDemo } from '@/components/forms/application-form';
export const metadata: Metadata = {
    title: 'Tasks',
    description: 'A task and issue tracker build using Tanstack Table.',
};

// Simulate a database read for applications.
async function getTasks() {
    const data = await fs.readFile(path.join(process.cwd(), 'app/(dashboard)/applications/data/applications.json'));

    const applications = JSON.parse(data.toString());

    return z.array(jobApplicationSchema).parse(applications);
}

export default async function TaskPage() {
    const applications = await getTasks();

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-4 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                    <p className="text-muted-foreground">Here&apos;s a list of your applications for this month!</p>
                </div>
                <DrawerDialogDemo />
            </div>
            <DataTable data={applications} columns={columns} />
        </div>
    );
}
