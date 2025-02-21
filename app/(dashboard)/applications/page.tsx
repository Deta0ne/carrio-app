import { promises as fs } from 'fs';
import path from 'path';
import { Metadata } from 'next';
import Image from 'next/image';
import { z } from 'zod';

import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { UserNav } from './components/user-nav';
import { jobApplicationSchema } from './data/schema';

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
        <>
            <div className="md:hidden">
                <Image
                    src="/examples/applications-light.png"
                    width={1280}
                    height={998}
                    alt="Playground"
                    className="block dark:hidden"
                />
                <Image
                    src="/examples/applications-dark.png"
                    width={1280}
                    height={998}
                    alt="Playground"
                    className="hidden dark:block"
                />
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                        <p className="text-muted-foreground">Here&apos;s a list of your applications for this month!</p>
                    </div>
                </div>
                <DataTable data={applications} columns={columns} />
            </div>
        </>
    );
}
