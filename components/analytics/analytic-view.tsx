'use client';

import { useState, useMemo } from 'react';
import { Calendar, Clock, PieChart as PieChartIcon, Briefcase, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { JobApplications } from '@/types/database';
import {
    calculateInterviewRate,
    calculateOfferRate,
    calculateAvgResponseTime,
    getMonthlyChange,
    calculateApplicationsMonthlyChange,
    handleExport,
} from './utils';
import { ApplicationOverview } from './application-overview';
import { PerformanceMetrics } from './performance-metrics';

export default function AnalyticView({ applications }: { applications: JobApplications[] }) {
    const [timeRange, setTimeRange] = useState('allTime');

    const filteredApplications = useMemo(() => {
        if (timeRange === 'allTime') {
            return applications.filter((app) => {
                try {
                    return !isNaN(new Date(app.application_date).getTime());
                } catch (e) {
                    return false;
                }
            });
        }
        const now = new Date();
        let startDate: Date | null = null;
        switch (timeRange) {
            case 'last7Days':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'last30Days':
                startDate = new Date(now.setDate(now.getDate() - 30));
                break;
            case 'last90Days':
                startDate = new Date(now.setDate(now.getDate() - 90));
                break;
            case 'thisYear':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                return applications;
        }
        if (!startDate || isNaN(startDate.getTime())) {
            return [];
        }
        const startTime = startDate.getTime();
        return applications.filter((app) => {
            try {
                const appDate = new Date(app.application_date);
                return !isNaN(appDate.getTime()) && appDate.getTime() >= startTime;
            } catch (e) {
                return false;
            }
        });
    }, [applications, timeRange]);

    const displayMetrics = useMemo(
        () => ({
            totalApplications: filteredApplications.length,
            interviewRate: calculateInterviewRate(filteredApplications),
            offerRate: calculateOfferRate(filteredApplications),
            avgResponseTime: calculateAvgResponseTime(filteredApplications),
        }),
        [filteredApplications],
    );

    const changeMetrics = useMemo(() => {
        if (timeRange !== 'allTime') {
            return { applicationsChange: '', interviewRateChange: '', offerRateChange: '' };
        }
        const now = new Date();
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const endOfLastMonthTime = endOfLastMonth.getTime();

        const appsUpToLastMonth = applications.filter((app) => {
            try {
                const appDate = new Date(app.application_date);
                return !isNaN(appDate.getTime()) && appDate.getTime() <= endOfLastMonthTime;
            } catch (e) {
                return false;
            }
        });

        const currentOverallInterviewRate = calculateInterviewRate(applications);
        const currentOverallOfferRate = calculateOfferRate(applications);
        const overallRateLastMonth = calculateInterviewRate(appsUpToLastMonth);
        const overallOfferRateLastMonth = calculateOfferRate(appsUpToLastMonth);

        return {
            applicationsChange: calculateApplicationsMonthlyChange(applications),
            interviewRateChange: getMonthlyChange(currentOverallInterviewRate, overallRateLastMonth),
            offerRateChange: getMonthlyChange(currentOverallOfferRate, overallOfferRateLastMonth),
        };
    }, [applications, timeRange]);

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <h1 className="flex-1 text-xl font-semibold tracking-tight sm:text-2xl">Analytics Dashboard</h1>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="last7Days">Last 7 Days</SelectItem>
                            <SelectItem value="last30Days">Last 30 Days</SelectItem>
                            <SelectItem value="last90Days">Last 90 Days</SelectItem>
                            <SelectItem value="thisYear">This Year</SelectItem>
                            <SelectItem value="allTime">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full gap-1 sm:w-auto">
                                <span>Export</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => handleExport('csv', applications, changeMetrics)}>
                                Export Summary & Rates as CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleExport('excel', applications, changeMetrics)}>
                                Export All Stats as Excel
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{displayMetrics.totalApplications}</div>
                        {timeRange === 'allTime' && (
                            <p className="text-xs text-muted-foreground">
                                {changeMetrics.applicationsChange} from last month
                            </p>
                        )}
                        {timeRange !== 'allTime' && <p className="text-xs text-muted-foreground">&nbsp;</p>}
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{displayMetrics.interviewRate}%</div>
                        {timeRange === 'allTime' && (
                            <p className="text-xs text-muted-foreground">
                                {changeMetrics.interviewRateChange} from last month
                            </p>
                        )}
                        {timeRange !== 'allTime' && <p className="text-xs text-muted-foreground">&nbsp;</p>}
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Offer Rate</CardTitle>
                        <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{displayMetrics.offerRate}%</div>
                        {timeRange === 'allTime' && (
                            <p className="text-xs text-muted-foreground">
                                {changeMetrics.offerRateChange} from last month
                            </p>
                        )}
                        {timeRange !== 'allTime' && <p className="text-xs text-muted-foreground">&nbsp;</p>}
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {displayMetrics.avgResponseTime > 0 ? `${displayMetrics.avgResponseTime} days` : 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground">&nbsp;</p>
                    </CardContent>
                </Card>
            </div>
            <div className="overflow-hidden">
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="w-full justify-start overflow-x-auto">
                        <TabsTrigger value="overview">Application Overview</TabsTrigger>
                        <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        <ApplicationOverview applications={filteredApplications} />
                    </TabsContent>
                    <TabsContent value="performance" className="space-y-4">
                        <PerformanceMetrics applications={filteredApplications} />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
