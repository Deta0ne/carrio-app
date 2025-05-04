'use client';

import { useState } from 'react';
import {
    Calendar,
    FileText,
    Filter,
    Home,
    LineChart,
    PieChart,
    Settings,
    Briefcase,
    Clock,
    ChevronDown,
    Search,
} from 'lucide-react';

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
    filterCurrentMonthApplications,
    filterPreviousMonthApplications,
} from './utils';
import { ApplicationOverview } from './application-overview';
import { PerformanceMetrics } from './performance-metrics';

export default function AnalyticView({ applications }: { applications: JobApplications[] }) {
    const [timeRange, setTimeRange] = useState('last30Days');
    // Calculate metrics
    console.log('applications', applications);
    const interviewRate = calculateInterviewRate(applications);
    const offerRate = calculateOfferRate(applications);
    const avgResponseTime = calculateAvgResponseTime(applications);

    // --- Calculate Overall Interview Rate Change Month-over-Month ---
    // 1. Get the end date of last month
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfLastMonth = new Date(startOfThisMonth.getTime() - 1); // Subtract 1 millisecond to get last day of previous month

    // 2. Filter applications made up to the end of last month
    const appsUpToLastMonth = applications.filter((app) => {
        try {
            const appDate = new Date(app.application_date);
            return !isNaN(appDate.getTime()) && appDate <= endOfLastMonth;
        } catch (e) {
            console.error('Error parsing application_date:', app.application_date, e);
            return false;
        }
    });

    // 3. Calculate the overall interview rate at the end of last month
    const overallRateLastMonth = calculateInterviewRate(appsUpToLastMonth);

    // 4. Calculate the change between current overall rate and last month's overall rate
    const interviewRateChange = getMonthlyChange(interviewRate, overallRateLastMonth);

    // 5. Calculate the overall offer rate at the end of last month
    const overallOfferRateLastMonth = calculateOfferRate(appsUpToLastMonth);

    // 6. Calculate the change for offer rate
    const offerRateChange = getMonthlyChange(offerRate, overallOfferRateLastMonth);

    // 7. Calculate the overall avg response time at the end of last month
    // const overallAvgResponseTimeLastMonth = calculateAvgResponseTime(appsUpToLastMonth); // Removed

    // 8. Calculate the change for avg response time
    // const responseTimeChange = getMonthlyChange(avgResponseTime, overallAvgResponseTimeLastMonth); // Removed
    // --- End of Overall Rate Change Calculation ---

    // Calculate month-over-month changes
    // const currentMonthApps = filterCurrentMonthApplications(applications); // No longer needed for these rate changes
    // const prevMonthApps = filterPreviousMonthApplications(applications); // No longer needed for these rate changes

    const applicationsChange = calculateApplicationsMonthlyChange(applications);
    // const offerRateChange = getMonthlyChange(calculateOfferRate(currentMonthApps), calculateOfferRate(prevMonthApps)); // Replaced above
    // const responseTimeChange = getMonthlyChange( // Replaced above
    //     calculateAvgResponseTime(currentMonthApps),
    //     calculateAvgResponseTime(prevMonthApps),
    // );

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center gap-4">
                <h1 className="flex-1 text-2xl font-semibold tracking-tight">Analytics Dashboard</h1>
                <div className="flex items-center gap-2">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[180px]">
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
                            <Button variant="outline" className="gap-1">
                                <span>Export</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                            <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                            <DropdownMenuItem>Schedule Reports</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{applications.length}</div>
                        <p className="text-xs text-muted-foreground">{applicationsChange} from last month</p>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{interviewRate}%</div>
                        <p className="text-xs text-muted-foreground">{interviewRateChange} from last month</p>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Offer Rate</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{offerRate}%</div>
                        <p className="text-xs text-muted-foreground">{offerRateChange} from last month</p>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgResponseTime} days</div>
                        <p className="text-xs text-muted-foreground">&nbsp;</p>
                    </CardContent>
                </Card>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Application Overview</TabsTrigger>
                    <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <ApplicationOverview applications={applications} />
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                    <PerformanceMetrics applications={applications} />
                </TabsContent>
            </Tabs>
        </main>
    );
}
