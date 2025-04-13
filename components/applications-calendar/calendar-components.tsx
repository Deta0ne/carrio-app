'use client';

import type { CalendarDayProps, CalendarEvent, CalendarEventProps, CalendarHeaderProps } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getEventTypeColor } from '@/utils/calendar-utils';

export function CalendarHeader({
    monthString,
    yearString,
    daysInMonth,
    eventCount,
    isCurrentMonth,
    goToPrevMonth,
    goToToday,
    goToNextMonth,
}: CalendarHeaderProps) {
    return (
        <div className="bg-[linear-gradient(to_top_left,#34e89e,#0f3443)] p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-5 w-5 text-white" />
                        <h2 className="text-xl font-semibold text-white">{monthString}</h2>
                        <span className="text-lg text-white/80">{yearString}</span>
                    </div>

                    <p className="text-xs text-white/70 mt-1">
                        {daysInMonth} days,{' '}
                        {eventCount > 0 ? `${eventCount} event${eventCount > 1 ? 's' : ''} today` : 'no events today'}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex border border-white/20 rounded-md shadow-sm overflow-hidden">
                        <Button
                            variant="ghost"
                            onClick={goToPrevMonth}
                            className="rounded-none border-r border-white/20 hover:bg-white/10 px-2.5 text-white"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous month</span>
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={goToToday}
                            disabled={isCurrentMonth}
                            className={cn(
                                'rounded-none px-2.5 text-x font-medium text-white',
                                isCurrentMonth ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10',
                            )}
                        >
                            Today
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={goToNextMonth}
                            className="rounded-none border-l border-white/20 hover:bg-white/10 px-2.5 text-white"
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next month</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CalendarLegend() {
    return (
        <div className="flex flex-wrap gap-6 px-6 py-2 bg-card border-b border-border">
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                <span className="text-xs text-muted-foreground">Interview</span>
            </div>
        </div>
    );
}

export function CalendarDay({
    day,
    events,
    isCurrentMonth = true,
    isTodayDate = false,
    onEventClick,
}: CalendarDayProps) {
    const hasEvents = events.length > 0;

    return (
        <div className={cn('aspect-square p-1.5', !isCurrentMonth && 'text-muted-foreground bg-muted/30')}>
            <div
                className={cn(
                    'h-full w-full rounded-lg p-1.5 transition-colors',
                    isTodayDate ? 'bg-primary/10' : '',
                    hasEvents && !isTodayDate ? 'border border-primary/40 bg-primary/5' : 'hover:bg-muted/50',
                )}
            >
                <div className="flex items-center justify-between">
                    <div
                        className={cn(
                            'text-xs font-medium mb-1.5',
                            isTodayDate
                                ? 'text-primary bg-primary/20 rounded-full w-5 h-5 flex items-center justify-center'
                                : '',
                        )}
                    >
                        {day}
                    </div>
                    {hasEvents && !isTodayDate && <div className="w-2 h-2 rounded-full bg-primary mr-1"></div>}
                </div>
                <div className="flex flex-col gap-1 mt-1">
                    {events.map((event) => (
                        <CalendarEvent key={event.id} event={event} onClick={() => onEventClick(event)} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function CalendarEvent({ event, onClick }: CalendarEventProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={onClick}
                        className={cn(
                            'text-xs px-1.5 py-0.5 rounded truncate max-w-full',
                            getEventTypeColor(event.type),
                        )}
                        aria-label={event.title}
                    >
                        {event.title}
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                    <p className="font-medium text-xs">{event.title}</p>
                    <p className="text-xs opacity-80">All day</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
