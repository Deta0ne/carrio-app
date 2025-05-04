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

export default function AnalyticView({ applications }: { applications: JobApplications[] }) {
    const [timeRange, setTimeRange] = useState('last30Days');
    console.log(applications);
    // Calculate metrics
    const interviewRate = calculateInterviewRate(applications);
    const offerRate = calculateOfferRate(applications);
    const avgResponseTime = calculateAvgResponseTime(applications);

    // Calculate month-over-month changes
    const currentMonthApps = filterCurrentMonthApplications(applications);
    const prevMonthApps = filterPreviousMonthApplications(applications);

    const applicationsChange = calculateApplicationsMonthlyChange(applications);
    const interviewRateChange = getMonthlyChange(
        calculateInterviewRate(currentMonthApps),
        calculateInterviewRate(prevMonthApps),
    );
    const offerRateChange = getMonthlyChange(calculateOfferRate(currentMonthApps), calculateOfferRate(prevMonthApps));
    const responseTimeChange = getMonthlyChange(
        calculateAvgResponseTime(currentMonthApps),
        calculateAvgResponseTime(prevMonthApps),
    );

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
                        <p className="text-xs text-muted-foreground">{responseTimeChange} from last month</p>
                    </CardContent>
                </Card>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Application Overview</TabsTrigger>
                    <TabsTrigger value="interviews">Interview Analytics</TabsTrigger>
                    <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
                    <TabsTrigger value="time">Time Analysis</TabsTrigger>
                    <TabsTrigger value="documents">Document Effectiveness</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    sad
                </TabsContent>
                <TabsContent value="interviews" className="space-y-4">
                    dat
                </TabsContent>
                <TabsContent value="performance" className="space-y-4">
                    tı
                </TabsContent>
                <TabsContent value="time" className="space-y-4">
                    zı
                </TabsContent>
                <TabsContent value="documents" className="space-y-4">
                    sa
                </TabsContent>
            </Tabs>
        </main>
    );
}
