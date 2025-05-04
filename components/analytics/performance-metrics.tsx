'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { JobApplications } from '@/types/database';

const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-6))',
];

export function PerformanceMetrics({ applications = [] }: { applications?: JobApplications[] }) {
    const responseTimes = React.useMemo(() => {
        const sources = ['LinkedIn', 'Company Website', 'Indeed', 'GitHub Jobs', 'Career Website', 'Other'];
        const sourceData = sources.map((source) => {
            const sourceApps = applications.filter((app) => app.source === source);
            if (sourceApps.length === 0) return { source, days: 0, count: 0, value: 0 };

            const appsWithResponse = sourceApps.filter((app) => app.interview_date || app.status === 'rejected');
            if (appsWithResponse.length === 0) return { source, days: 0, count: 0, value: 0 };

            let totalDays = 0;
            let validResponseCount = 0;

            appsWithResponse.forEach((app) => {
                try {
                    const appDate = new Date(app.application_date);
                    const responseDate = app.interview_date ? new Date(app.interview_date) : new Date(app.last_update);

                    if (isNaN(appDate.getTime()) || isNaN(responseDate.getTime())) {
                        console.warn('Invalid date found for application:', app.id);
                        return;
                    }

                    const diffTime = responseDate.getTime() - appDate.getTime();
                    if (diffTime >= 0) {
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        totalDays += diffDays;
                        validResponseCount++;
                    }
                } catch (error) {
                    console.error('Error processing date for application:', app.id, error);
                }
            });

            if (validResponseCount === 0) return { source, days: 0, count: 0, value: 0 };

            const averageDays = Math.round(totalDays / validResponseCount);
            return {
                source,
                days: averageDays,
                count: validResponseCount,
                value: Math.min(100, Math.round((averageDays / 60) * 100)),
            };
        });

        const allAppsWithResponse = applications.filter((app) => app.interview_date || app.status === 'rejected');
        let overallAverage = 0;
        let overallValue = 0;
        let totalOverallDays = 0;
        let validOverallCount = 0;

        if (allAppsWithResponse.length > 0) {
            allAppsWithResponse.forEach((app) => {
                try {
                    const appDate = new Date(app.application_date);
                    const responseDate = app.interview_date ? new Date(app.interview_date) : new Date(app.last_update);

                    if (isNaN(appDate.getTime()) || isNaN(responseDate.getTime())) {
                        console.warn('Invalid date found for overall calculation, app:', app.id);
                        return;
                    }

                    const diffTime = responseDate.getTime() - appDate.getTime();
                    if (diffTime >= 0) {
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        totalOverallDays += diffDays;
                        validOverallCount++;
                    }
                } catch (error) {
                    console.error('Error processing date for overall calculation:', app.id, error);
                }
            });

            if (validOverallCount > 0) {
                overallAverage = Math.round(totalOverallDays / validOverallCount);
                overallValue = Math.min(100, Math.round((overallAverage / 60) * 100));
            }
        }

        return {
            sourceData: sourceData.filter((d) => d.count > 0),
            overall: {
                days: overallAverage,
                value: overallValue,
            },
        };
    }, [applications]);

    const responseRateData = React.useMemo(() => {
        const sources = ['LinkedIn', 'Company Website', 'Indeed', 'GitHub Jobs', 'Career Website', 'Other'];
        return sources
            .map((source, index) => {
                const sourceApps = applications.filter((app) => app.source === source);
                if (sourceApps.length === 0)
                    return { source, rate: 0, count: 0, fill: chartColors[index % chartColors.length] };

                const responsesCount = sourceApps.filter(
                    (app) =>
                        app.status === 'interview_stage' ||
                        app.status === 'offer_received' ||
                        app.status === 'rejected' ||
                        app.interview_date,
                ).length;

                return {
                    source,
                    rate: Math.round((responsesCount / sourceApps.length) * 100),
                    count: sourceApps.length,
                    fill: chartColors[index % chartColors.length],
                };
            })
            .filter((item) => item.count > 0);
    }, [applications]);

    const responseRateConfig = {
        rate: {
            label: 'Response Rate (%)',
        },
        source: {
            label: 'Application Source',
        },
    } satisfies ChartConfig;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Response Rate by Source</CardTitle>
                    <CardDescription>Percentage of applications receiving a response per source</CardDescription>
                </CardHeader>
                <CardContent className="px-2 sm:p-6">
                    <ChartContainer config={responseRateConfig} className="aspect-auto h-[250px] w-full">
                        <BarChart
                            accessibilityLayer
                            data={responseRateData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="source" tickLine={false} axisLine={false} tickMargin={8} />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent className="w-[150px]" formatter={(value) => `${value}%`} />
                                }
                            />
                            <Bar dataKey="rate" name="Response Rate (%)">
                                {responseRateData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Average Response Time</CardTitle>
                    <CardDescription>Days from application to first response</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {responseTimes.sourceData.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="font-medium">{item.source}</div>
                                    <div>{item.days > 0 ? `${item.days} days` : 'N/A'}</div>
                                </div>
                                <Progress value={item.days > 0 ? item.value : 0} className="h-2" />
                            </div>
                        ))}
                        {responseTimes.sourceData.length > 0 && (
                            <div className="space-y-2 border-t pt-4 mt-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="font-medium">Overall Average</div>
                                    <div>
                                        {responseTimes.overall.days > 0 ? `${responseTimes.overall.days} days` : 'N/A'}
                                    </div>
                                </div>
                                <Progress
                                    value={responseTimes.overall.days > 0 ? responseTimes.overall.value : 0}
                                    className="h-2"
                                />
                            </div>
                        )}
                        {responseTimes.sourceData.length === 0 && (
                            <div className="text-sm text-center text-muted-foreground py-4">
                                No response data available yet
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
