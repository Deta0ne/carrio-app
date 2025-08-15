import { JobApplications } from '@/types/database';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Calculate interview rate for the given applications
 */
export const calculateInterviewRate = (applications: JobApplications[]): number => {
    const interviewCount = applications.filter(
        (app) => app.status === 'interview_stage' || app.interview_date !== null,
    ).length;
    return applications.length > 0 ? Math.round((interviewCount / applications.length) * 100) : 0;
};

/**
 * Calculate offer rate for the given applications
 */
export const calculateOfferRate = (applications: JobApplications[]): number => {
    const offerCount = applications.filter(
        (app) => app.status === 'offer_received' 
    ).length;

    return applications.length > 0 ? Math.round((offerCount / applications.length) * 100) : 0;
};

/**
 * Calculate average response time (in days) for the given applications
 */
export const calculateAvgResponseTime = (applications: JobApplications[]): number => {
    const appsWithResponse = applications.filter(app => 
        app.status === 'rejected' || 
        app.status === 'offer_received' || 
        app.status === 'interview_stage'
    );

    if (appsWithResponse.length === 0) return 0;
    let totalDays = 0;
    let validResponseCount = 0;

    appsWithResponse.forEach(app => {
        try {
            const appDate = new Date(app.application_date);
            const responseDate = app.interview_date ? new Date(app.interview_date) : new Date(app.last_update);
            
            if (isNaN(appDate.getTime()) || isNaN(responseDate.getTime())) {
                return;
            }

            const diffTime = responseDate.getTime() - appDate.getTime();
            if (diffTime >= 0) {
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays >= 1) {
                    totalDays += diffDays;
                    validResponseCount++;
                }
            }
        } catch (error) {
            console.error("Error processing date for avg response time calculation:", app.id, error);
        }
    });

    if (validResponseCount === 0) return 0;

    return Math.round(totalDays / validResponseCount);
};

/**
 * Calculate the month-over-month change as a percentage
 */
export const getMonthlyChange = (currentValue: number, previousValue: number): string => {
    if (!previousValue) return '+0%';

    const change = ((currentValue - previousValue) / previousValue) * 100;
    return change >= 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
};

/**
 * Filter applications to only include those from the current month
 */
export const filterCurrentMonthApplications = (applications: JobApplications[]): JobApplications[] => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return applications.filter(app => {
        const appDate = new Date(app.application_date);
        return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
    });
};

/**
 * Filter applications to only include those from the previous month
 */
export const filterPreviousMonthApplications = (applications: JobApplications[]): JobApplications[] => {
    const now = new Date();
    let prevMonth = now.getMonth() - 1;
    let prevYear = now.getFullYear();
    
    if (prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
    }
    
    return applications.filter(app => {
        const appDate = new Date(app.application_date);
        return appDate.getMonth() === prevMonth && appDate.getFullYear() === prevYear;
    });
};

/**
 * Calculate the total applications month-over-month change
 */
export const calculateApplicationsMonthlyChange = (applications: JobApplications[]): string => {
    const currentMonth = filterCurrentMonthApplications(applications);
    const previousMonth = filterPreviousMonthApplications(applications);
    return getMonthlyChange(currentMonth.length, previousMonth.length);
};

export const handleExport = (format: 'csv' | 'excel', applications: JobApplications[], changeMetrics: { applicationsChange: string, interviewRateChange: string, offerRateChange: string }) => {
    const summaryStats = {
        Metric: 'Value',
        'Total Applications': applications.length,
        'Interview Rate (%)': calculateInterviewRate(applications),
        'Offer Rate (%)': calculateOfferRate(applications),
        'Avg. Response Time (days)': calculateAvgResponseTime(applications),
        '---': '---',
        'Total Apps Change (vs last month)': changeMetrics.applicationsChange,
        'Interview Rate Change (vs last month)': changeMetrics.interviewRateChange,
        'Offer Rate Change (vs last month)': changeMetrics.offerRateChange,
    };
    const summaryDataForSheet = Object.entries(summaryStats).map(([Metric, Value]) => ({ Metric, Value }));

    const sources = ['LinkedIn', 'Company Website', 'Indeed', 'GitHub Jobs', 'Career Website', 'Other'];

    const statusCounts = { draft: 0, planned: 0, pending: 0, interview_stage: 0, offer_received: 0, rejected: 0 };
    applications.forEach((app) => {
        if (statusCounts[app.status] !== undefined) {
            statusCounts[app.status]++;
        }
    });
    const applicationStatusData = Object.entries(statusCounts).map(([Status, Count]) => ({ Status, Count }));

    const fullResponseRateData = sources
        .map((source) => {
            const sourceApps = applications.filter((a) => a.source === source);
            if (!sourceApps.length) return null;
            const count = sourceApps.filter(
                (a) =>
                    a.status === 'interview_stage' ||
                    a.status === 'offer_received' ||
                    a.status === 'rejected' ||
                    a.interview_date,
            ).length;
            return {
                Source: source,
                'Response Rate (%)': Math.round((count / sourceApps.length) * 100),
                'Total Applications': sourceApps.length,
            };
        })
        .filter(Boolean);

    const fullResponseTimesData = sources
        .map((source) => {
            const sourceApps = applications.filter((a) => a.source === source);
            if (!sourceApps.length) return null;
            const responded = sourceApps.filter((a) => a.interview_date || a.status === 'rejected');
            if (!responded.length)
                return { Source: source, 'Avg Response Time (days)': 'N/A', 'Responded Count': 0 };
            let totalDays = 0;
            let validCount = 0;
            responded.forEach((app) => {
                try {
                    const appD = new Date(app.application_date);
                    const respD = app.interview_date ? new Date(app.interview_date) : new Date(app.last_update);
                    if (isNaN(appD.getTime()) || isNaN(respD.getTime())) return;
                    const diffT = respD.getTime() - appD.getTime();
                    if (diffT >= 0) {
                        const diffD = Math.ceil(diffT / 86400000);
                        if (diffD >= 1) {
                            totalDays += diffD;
                            validCount++;
                        }
                    }
                } catch (e) {}
            });
            const avgD = validCount > 0 ? Math.round(totalDays / validCount) : 0;
            return {
                Source: source,
                'Avg Response Time (days)': avgD > 0 ? avgD : 'N/A',
                'Responded Count': validCount,
            };
        })
        .filter(Boolean);

    if (format === 'csv') {
        try {
            const wsSummary = XLSX.utils.json_to_sheet(summaryDataForSheet, { skipHeader: true });
            const wsResponseRate = XLSX.utils.json_to_sheet(fullResponseRateData);
            const csvSummary = XLSX.utils.sheet_to_csv(wsSummary);
            const csvResponseRate = XLSX.utils.sheet_to_csv(wsResponseRate);
            const combinedCsv = `${csvSummary}\n\n${csvResponseRate}`;
            const blob = new Blob([combinedCsv], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, `analytics-summary-and-rates-allTime.csv`);
        } catch (error) {
            console.error('Error exporting CSV:', error);
            alert('Failed CSV export.');
        }
        return;
    }

    if (format === 'excel') {
        try {
            const wb = XLSX.utils.book_new();
            const wsSummary = XLSX.utils.json_to_sheet(summaryDataForSheet);
            const wsResponseRate = XLSX.utils.json_to_sheet(fullResponseRateData);
            const wsResponseTime = XLSX.utils.json_to_sheet(fullResponseTimesData);
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
            alert('Failed Excel export.');
        }
    }
};