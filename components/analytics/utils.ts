// components/analytics/utils/calculations.ts
import { JobApplications } from '@/types/database';

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
    // Filter for applications that have reached a definitive response stage
    const appsWithResponse = applications.filter(app => 
        app.status === 'rejected' || 
        app.status === 'offer_received' || 
        app.status === 'interview_stage'
    );

    if (appsWithResponse.length === 0) return 0;
    console.log('appsWithResponse',appsWithResponse);
    let totalDays = 0;
    let validResponseCount = 0;

    appsWithResponse.forEach(app => {
        try {
            const appDate = new Date(app.application_date);
            const responseDate = app.interview_date ? new Date(app.interview_date) : new Date(app.last_update);
            
            if (isNaN(appDate.getTime()) || isNaN(responseDate.getTime())) {
                console.warn("Invalid date found for avg response time calculation, app:", app.id);
                return; // Skip this application
            }

            const diffTime = responseDate.getTime() - appDate.getTime();
            // Only consider positive time differences AND difference must be at least 1 day
            if (diffTime >= 0) {
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays >= 1) { // Check if the difference is at least 1 day
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
    console.log(currentMonth.length, previousMonth.length);
    return getMonthlyChange(currentMonth.length, previousMonth.length);
};