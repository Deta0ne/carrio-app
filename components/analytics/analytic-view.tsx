'use client';

import { useState, useMemo } from 'react';
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
    const [timeRange, setTimeRange] = useState('allTime');

    // 1. Filter applications based on timeRange
    const filteredApplications = useMemo(() => {
        const now = new Date();
        let startDate: Date | null = null;

        switch (timeRange) {
            case 'last7Days':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                break;
            case 'last30Days':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                break;
            case 'last90Days':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                break;
            case 'thisYear':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            case 'allTime':
            default:
                return applications; // No filtering for allTime
        }

        return applications.filter((app) => {
            try {
                const appDate = new Date(app.application_date);
                return !isNaN(appDate.getTime()) && appDate >= startDate!;
            } catch (e) {
                console.error('Error parsing application_date for filtering:', app.application_date, e);
                return false;
            }
        });
    }, [applications, timeRange]);

    // 2. Calculate metrics based on filtered applications
    const displayTotalApplications = filteredApplications.length;
    const displayInterviewRate = calculateInterviewRate(filteredApplications);
    const displayOfferRate = calculateOfferRate(filteredApplications);
    const displayAvgResponseTime = calculateAvgResponseTime(filteredApplications);

    // --- Calculate Month-over-Month Changes (Only for 'allTime' view) ---
    let applicationsChange = '';
    let interviewRateChange = '';
    let offerRateChange = '';

    if (timeRange === 'allTime') {
        // Calculate overall rate changes vs last month
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfLastMonth = new Date(startOfThisMonth.getTime() - 1);

        const appsUpToLastMonth = applications.filter((app) => {
            try {
                const appDate = new Date(app.application_date);
                return !isNaN(appDate.getTime()) && appDate <= endOfLastMonth;
            } catch (e) {
                console.error('Error parsing application_date:', app.application_date, e);
                return false;
            }
        });

        const overallRateLastMonth = calculateInterviewRate(appsUpToLastMonth);
        const overallOfferRateLastMonth = calculateOfferRate(appsUpToLastMonth);
        // Use the originally calculated overall rates for the current period
        const currentOverallInterviewRate = calculateInterviewRate(applications);
        const currentOverallOfferRate = calculateOfferRate(applications);

        interviewRateChange = getMonthlyChange(currentOverallInterviewRate, overallRateLastMonth);
        offerRateChange = getMonthlyChange(currentOverallOfferRate, overallOfferRateLastMonth);

        // Calculate total applications change (current month vs previous month)
        applicationsChange = calculateApplicationsMonthlyChange(applications);
    }
    // --- End of Change Calculation ---

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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{displayTotalApplications}</div>
                        {timeRange === 'allTime' && (
                            <p className="text-xs text-muted-foreground">{applicationsChange} from last month</p>
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
                        <div className="text-2xl font-bold">{displayInterviewRate}%</div>
                        {timeRange === 'allTime' && (
                            <p className="text-xs text-muted-foreground">{interviewRateChange} from last month</p>
                        )}
                        {timeRange !== 'allTime' && <p className="text-xs text-muted-foreground">&nbsp;</p>}
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Offer Rate</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{displayOfferRate}%</div>
                        {timeRange === 'allTime' && (
                            <p className="text-xs text-muted-foreground">{offerRateChange} from last month</p>
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
                            {displayAvgResponseTime > 0 ? `${displayAvgResponseTime} days` : 'N/A'}
                        </div>
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
