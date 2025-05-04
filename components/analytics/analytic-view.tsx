'use client';

import { useState, useMemo } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Calendar, PieChart, Briefcase, Clock, ChevronDown } from 'lucide-react';

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
} from './utils';
import { ApplicationOverview } from './application-overview';
import { PerformanceMetrics } from './performance-metrics';

export default function AnalyticView({ applications }: { applications: JobApplications[] }) {
    const [timeRange, setTimeRange] = useState('allTime'); // Default to allTime

    // 1. Filter applications based on timeRange
    const filteredApplications = useMemo(() => {
        if (timeRange === 'allTime') {
            // For allTime, just return all applications (consider filtering invalid dates if necessary)
            return applications.filter((app) => {
                try {
                    const appDate = new Date(app.application_date);
                    return !isNaN(appDate.getTime());
                } catch (e) {
                    return false;
                }
            });
        }

        const now = new Date();
        let startDate: Date | null = null;

        switch (timeRange) {
            case 'last7Days':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                break;
            case 'last30Days':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30); // Corrected logic
                break;
            case 'last90Days':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90); // Corrected logic
                break;
            case 'thisYear':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                return applications; // Should not happen, but fallback
        }

        // Ensure startDate is valid before filtering
        if (!startDate || isNaN(startDate.getTime())) {
            console.error('Invalid start date generated for time range:', timeRange);
            return []; // Return empty if start date is invalid
        }

        // Now filter based on the calculated startDate
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
    const { applicationsChange, interviewRateChange, offerRateChange } = useMemo(() => {
        if (timeRange !== 'allTime') {
            return { applicationsChange: '', interviewRateChange: '', offerRateChange: '' };
        }
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

    // --- Export Functions ---
    const handleExport = (format: 'csv' | 'excel') => {
        // Recalculate all necessary stats using the full dataset (`applications`)
        // These calculations mirror the logic in child components but use the full dataset for export

        // 1. Summary Stats (for both CSV and Excel)
        const summaryStats = {
            Metric: 'Value',
            'Total Applications': applications.length,
            'Interview Rate (%)': calculateInterviewRate(applications),
            'Offer Rate (%)': calculateOfferRate(applications),
            'Avg. Response Time (days)': calculateAvgResponseTime(applications),
            '---': '---', // Separator
            'Total Apps Change (vs last month)': applicationsChange,
            'Interview Rate Change (vs last month)': interviewRateChange,
            'Offer Rate Change (vs last month)': offerRateChange,
        };
        const summaryDataForSheet = Object.entries(summaryStats).map(([Metric, Value]) => ({ Metric, Value }));

        if (format === 'csv') {
            try {
                // Calculate source response rates for CSV as well
                const sources = ['LinkedIn', 'Company Website', 'Indeed', 'GitHub Jobs', 'Career Website', 'Other'];
                const responseRateData = sources
                    .map((source) => {
                        const sourceApps = applications.filter((app) => app.source === source);
                        if (sourceApps.length === 0) return null;
                        const responsesCount = sourceApps.filter(
                            (app) =>
                                app.status === 'interview_stage' ||
                                app.status === 'offer_received' ||
                                app.status === 'rejected' ||
                                app.interview_date,
                        ).length;
                        return {
                            Source: source,
                            'Response Rate (%)': Math.round((responsesCount / sourceApps.length) * 100),
                            'Total Applications': sourceApps.length,
                        };
                    })
                    .filter((item) => item !== null);

                // Convert both data sets to sheets
                const wsSummary = XLSX.utils.json_to_sheet(summaryDataForSheet, { skipHeader: true });
                const wsResponseRate = XLSX.utils.json_to_sheet(responseRateData);

                // Convert sheets to CSV strings
                const csvSummary = XLSX.utils.sheet_to_csv(wsSummary);
                const csvResponseRate = XLSX.utils.sheet_to_csv(wsResponseRate);

                // Combine CSV strings with a separator
                const combinedCsv = `${csvSummary}\n\n${csvResponseRate}`;

                const blob = new Blob([combinedCsv], { type: 'text/csv;charset=utf-8;' });
                saveAs(blob, `analytics-summary-and-rates-allTime.csv`);
            } catch (error) {
                console.error('Error exporting Combined CSV:', error);
                alert('Failed to export Combined CSV.');
            }
            return; // Stop here for CSV
        }

        // 2. Performance Metrics Data (for Excel)
        const sources = ['LinkedIn', 'Company Website', 'Indeed', 'GitHub Jobs', 'Career Website', 'Other'];

        // Response Rates by Source
        const responseRateData = sources
            .map((source, index) => {
                const sourceApps = applications.filter((app) => app.source === source);
                if (sourceApps.length === 0) return null; // Skip if no apps for this source
                const responsesCount = sourceApps.filter(
                    (app) =>
                        app.status === 'interview_stage' ||
                        app.status === 'offer_received' ||
                        app.status === 'rejected' ||
                        app.interview_date,
                ).length;
                return {
                    Source: source,
                    'Response Rate (%)': Math.round((responsesCount / sourceApps.length) * 100),
                    'Total Applications': sourceApps.length,
                };
            })
            .filter((item) => item !== null); // Remove null entries

        // Avg Response Times by Source
        const responseTimesData = sources
            .map((source) => {
                const sourceApps = applications.filter((app) => app.source === source);
                if (sourceApps.length === 0) return null;
                const appsWithResponse = sourceApps.filter((app) => app.interview_date || app.status === 'rejected');
                if (appsWithResponse.length === 0)
                    return { Source: source, 'Avg Response Time (days)': 'N/A', 'Responded Count': 0 };
                let totalDays = 0,
                    validResponseCount = 0;
                appsWithResponse.forEach((app) => {
                    try {
                        const appDate = new Date(app.application_date);
                        const responseDate = app.interview_date
                            ? new Date(app.interview_date)
                            : new Date(app.last_update);
                        if (isNaN(appDate.getTime()) || isNaN(responseDate.getTime())) return;
                        const diffTime = responseDate.getTime() - appDate.getTime();
                        if (diffTime >= 0) {
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            if (diffDays >= 1) {
                                totalDays += diffDays;
                                validResponseCount++;
                            }
                        }
                    } catch (e) {}
                });
                const averageDays = validResponseCount > 0 ? Math.round(totalDays / validResponseCount) : 0;
                return {
                    Source: source,
                    'Avg Response Time (days)': averageDays > 0 ? averageDays : 'N/A',
                    'Responded Count': validResponseCount,
                };
            })
            .filter((item) => item !== null);

        // 3. Application Status Data (for Excel)
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
        const applicationStatusData = Object.entries(statusCounts).map(([Status, Count]) => ({ Status, Count }));

        // 4. Create Excel Workbook
        if (format === 'excel') {
            try {
                const wb = XLSX.utils.book_new();
                const wsSummary = XLSX.utils.json_to_sheet(summaryDataForSheet);
                const wsResponseRate = XLSX.utils.json_to_sheet(responseRateData);
                const wsResponseTime = XLSX.utils.json_to_sheet(responseTimesData);
                const wsStatus = XLSX.utils.json_to_sheet(applicationStatusData);

                XLSX.utils.book_append_sheet(wb, wsSummary, 'Overall Summary');
                XLSX.utils.book_append_sheet(wb, wsResponseRate, 'Response Rate by Source');
                XLSX.utils.book_append_sheet(wb, wsResponseTime, 'Avg Response Time by Source');
                XLSX.utils.book_append_sheet(wb, wsStatus, 'Applications by Status');

                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
                });
                saveAs(blob, `analytics-all-stats-allTime.xlsx`);
            } catch (error) {
                console.error('Error exporting Excel:', error);
                alert('Failed to export Excel.');
            }
        }
    };
    // --- End Export Functions ---

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
                            <DropdownMenuItem onSelect={() => handleExport('csv')}>
                                Export Summary & Rates as CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleExport('excel')}>
                                Export All Stats as Excel
                            </DropdownMenuItem>
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
                    <ApplicationOverview applications={filteredApplications} />
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                    <PerformanceMetrics applications={filteredApplications} />
                </TabsContent>
            </Tabs>
        </main>
    );
}
