'use client';

import { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { EventDetails } from './event-details';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { CalendarEvent, JobApplication } from '@/types/calendar';
import { isSameDay } from '@/utils/calendar-utils';
import { CalendarHeader, CalendarLegend, CalendarDay } from './calendar-components';

interface CalendarProps {
    applications: JobApplication[];
}

export function Calendar({ applications }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    const daysFromPrevMonth = firstDayOfWeek;
    const totalDaysToShow = Math.ceil((daysInMonth + daysFromPrevMonth) / 7) * 7;
    const daysFromNextMonth = totalDaysToShow - daysInMonth - daysFromPrevMonth;
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

    const goToPrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const monthString = currentDate.toLocaleString('en-US', { month: 'long' });
    const yearString = currentDate.getFullYear().toString();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getAllEvents = (): CalendarEvent[] => {
        return applications.map((app) => ({
            id: `event-${app.id}`,
            applicationId: app.id,
            title: `Interview: ${app.position} at ${app.company_name}`,
            date: new Date(app.interview_date),
            type: 'interview' as const,
        }));
    };

    const getEventsByDate = (date: Date): CalendarEvent[] => {
        return getAllEvents().filter((event) => isSameDay(event.date, date));
    };

    const getEventsForDay = (year: number, month: number, day: number) => {
        const date = new Date(year, month, day);
        return getEventsByDate(date);
    };

    const isToday = (year: number, month: number, day: number) => {
        const today = new Date();
        return isSameDay(today, new Date(year, month, day));
    };

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
    };

    const closeEventDetails = () => {
        setSelectedEvent(null);
    };

    const isCurrentMonth = isToday(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const todayEvents = getEventsByDate(new Date());

    if (isLoading) {
        return (
            <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading interview data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to load interview data. Please try refreshing the page.</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="rounded-xl shadow-sm overflow-hidden border border-border">
            <CalendarHeader
                monthString={monthString}
                yearString={yearString}
                daysInMonth={daysInMonth}
                eventCount={todayEvents.length}
                isCurrentMonth={isCurrentMonth}
                goToPrevMonth={goToPrevMonth}
                goToToday={goToToday}
                goToNextMonth={goToNextMonth}
            />

            <CalendarLegend />

            <div className="grid grid-cols-7 bg-card">
                {/* Days of the week */}
                {daysOfWeek.map((day, index) => (
                    <div
                        key={index}
                        className="py-2 text-center font-medium text-xs text-muted-foreground border-b border-border"
                    >
                        {day}
                    </div>
                ))}

                {/* Previous month days */}
                {Array.from({ length: daysFromPrevMonth }).map((_, index) => {
                    const day = prevMonthLastDay - daysFromPrevMonth + index + 1;
                    const month = currentDate.getMonth() - 1;
                    const year = month < 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
                    const adjustedMonth = month < 0 ? 11 : month;
                    const events = getEventsForDay(year, adjustedMonth, day);

                    return (
                        <CalendarDay
                            key={`prev-${index}`}
                            day={day}
                            events={events}
                            isCurrentMonth={false}
                            onEventClick={handleEventClick}
                        />
                    );
                })}

                {/* Current month days */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const events = getEventsForDay(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isTodayDate = isToday(currentDate.getFullYear(), currentDate.getMonth(), day);

                    return (
                        <CalendarDay
                            key={`current-${index}`}
                            day={day}
                            events={events}
                            isTodayDate={isTodayDate}
                            onEventClick={handleEventClick}
                        />
                    );
                })}

                {/* Next month days */}
                {Array.from({ length: daysFromNextMonth }).map((_, index) => {
                    const day = index + 1;
                    const month = currentDate.getMonth() + 1;
                    const year = month > 11 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
                    const adjustedMonth = month > 11 ? 0 : month;
                    const events = getEventsForDay(year, adjustedMonth, day);

                    return (
                        <CalendarDay
                            key={`next-${index}`}
                            day={day}
                            events={events}
                            isCurrentMonth={false}
                            onEventClick={handleEventClick}
                        />
                    );
                })}
            </div>

            {/* Event Details Modal */}
            {selectedEvent && (
                <EventDetails event={selectedEvent} onClose={closeEventDetails} applications={applications} />
            )}
        </div>
    );
}
