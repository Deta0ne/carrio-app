'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Pie, PieChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobApplications } from '@/types/database';

const trendsChartConfig = {
    visitors: {
        label: 'Applications',
    },
    applied: {
        label: 'Applied',
        color: 'hsl(var(--chart-2))',
    },
    rejected: {
        label: 'Rejected',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

const statusChartConfig = {
    count: {
        label: 'Applications',
    },
    planned: {
        label: 'Planned',
        color: 'hsl(var(--chart-1))',
    },
    pending: {
        label: 'Pending',
        color: 'hsl(var(--chart-2))',
    },
    interview_stage: {
        label: 'Interview',
        color: 'hsl(var(--chart-3))',
    },
    rejected: {
        label: 'Rejected',
        color: 'hsl(var(--chart-4))',
    },
    offer_received: {
        label: 'Offered',
        color: 'hsl(var(--chart-5))',
    },
} satisfies ChartConfig;

export function ApplicationOverview({ applications = [] }: { applications?: JobApplications[] }) {
    const [timeRange, setTimeRange] = React.useState('90d');

    const applicationStatusData = React.useMemo(() => {
        const statusCounts = {
            planned: 0,
            pending: 0,
            interview_stage: 0,
            offer_received: 0,
            rejected: 0,
        };

        applications.forEach((app) => {
            if (statusCounts[app.status] !== undefined) {
                statusCounts[app.status]++;
            }
        });

        return Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count,
            fill: `var(--color-${status})`,
        }));
    }, [applications]);

    const applicationTrendsData = React.useMemo(() => {
        const weekMap = new Map();

        applications.forEach((app) => {
            const date = new Date(app.application_date);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!weekMap.has(weekKey)) {
                weekMap.set(weekKey, { date: weekKey, applied: 0, rejected: 0 });
            }

            const weekData = weekMap.get(weekKey);
            if (app.status === 'rejected') {
                weekData.rejected += 1;
            } else {
                weekData.applied += 1;
            }
        });

        return Array.from(weekMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [applications]);

    const filteredTrendData = React.useMemo(() => {
        if (applicationTrendsData.length === 0) return [];

        const lastDate = new Date(applicationTrendsData[applicationTrendsData.length - 1].date);
        let daysToSubtract = 90;

        if (timeRange === '30d') {
            daysToSubtract = 30;
        } else if (timeRange === '7d') {
            daysToSubtract = 7;
        }

        const startDate = new Date(lastDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);

        return applicationTrendsData.filter((item) => {
            const date = new Date(item.date);
            return date >= startDate;
        });
    }, [applicationTrendsData, timeRange]);

    const maxYValue = React.useMemo(() => {
        if (!filteredTrendData || filteredTrendData.length === 0) return 0;
        return Math.max(...filteredTrendData.map((item) => (item.applied || 0) + (item.rejected || 0)));
    }, [filteredTrendData]);

    const yAxisUpperBound = Math.ceil(maxYValue * 1.1);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                    <div className="grid flex-1 gap-1 text-center sm:text-left">
                        <CardTitle>Application Trends</CardTitle>
                        <CardDescription>Weekly application submissions over time</CardDescription>
                    </div>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select time range">
                            <SelectValue placeholder="Last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                Last 3 months
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    <ChartContainer config={trendsChartConfig} className="aspect-auto h-[280px] w-full">
                        <AreaChart data={filteredTrendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="fillApplied" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-applied)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-applied)" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillRejected" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-rejected)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-rejected)" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    });
                                }}
                            />
                            <YAxis hide={true} domain={[0, yAxisUpperBound]} />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            });
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                dataKey="rejected"
                                type="natural"
                                fill="url(#fillRejected)"
                                stroke="var(--color-rejected)"
                                stackId="a"
                            />
                            <Area
                                dataKey="applied"
                                type="natural"
                                fill="url(#fillApplied)"
                                stroke="var(--color-applied)"
                                stackId="a"
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Applications by Status</CardTitle>
                    <CardDescription>Current status distribution</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer config={statusChartConfig} className="mx-auto aspect-square max-h-[300px]">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
                            <Pie data={applicationStatusData} dataKey="count" label nameKey="status" />
                            <ChartLegend
                                content={<ChartLegendContent nameKey="status" />}
                                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                            />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                        Applications: {applications.length} <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        {applications.length > 0
                            ? `Earliest application: ${new Date(
                                  Math.min(...applications.map((a) => new Date(a.application_date).getTime())),
                              ).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                            : 'No applications yet'}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
