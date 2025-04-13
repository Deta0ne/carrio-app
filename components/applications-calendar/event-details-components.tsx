'use client';

import { X, Calendar, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
    getEventTypeIcon,
    getEventTypeStyles,
    getStatusIconAndColor,
    getStatusVariant,
    formatStatusText,
    formatEventType,
} from '@/utils/calendar-utils';
import type {
    EventDateInfoProps,
    EventDescriptionProps,
    EventHeaderProps,
    EventInfoItemProps,
    EventStatusInfoProps,
    EventTypeInfoProps,
} from '@/types/calendar';

export function EventHeader({ event, application, onClose }: EventHeaderProps) {
    return (
        <CardHeader className="pt-5 pb-4">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
                    {application && (
                        <CardDescription className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>
                                {application.company_name} - {application.position}
                            </span>
                        </CardDescription>
                    )}
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 ml-2 -mr-2 -mt-2">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Button>
            </div>
        </CardHeader>
    );
}

export function EventInfoItem({ icon, title, children }: EventInfoItemProps) {
    return (
        <>
            <div className="flex items-center justify-center rounded-md w-10 h-10 bg-primary/10">{icon}</div>
            <div>
                <div className="text-sm font-medium">{title}</div>
                {children}
            </div>
        </>
    );
}

export function EventDateInfo({ date }: EventDateInfoProps) {
    const formattedDate = format(date, 'EEEE, MMMM d, yyyy', { locale: enUS });

    return (
        <EventInfoItem icon={<Calendar className="h-5 w-5 text-primary" />} title="Date & Time">
            <div className="text-sm text-muted-foreground">{formattedDate}</div>
        </EventInfoItem>
    );
}

export function EventTypeInfo({ type }: EventTypeInfoProps) {
    return (
        <EventInfoItem icon={<div className="text-primary">{getEventTypeIcon(type)}</div>} title="Event Type">
            <Badge variant="outline" className={cn('mt-1', getEventTypeStyles(type))}>
                {formatEventType(type)}
            </Badge>
        </EventInfoItem>
    );
}

export function EventStatusInfo({ status, applicationDate }: EventStatusInfoProps) {
    const statusDisplay = getStatusIconAndColor(status);

    return (
        <EventInfoItem
            icon={<div className={statusDisplay.iconColor}>{statusDisplay.icon}</div>}
            title="Application Status"
        >
            <Badge variant="outline" className={cn('mt-1', getStatusVariant(status))}>
                {formatStatusText(status)}
            </Badge>
        </EventInfoItem>
    );
}

export function EventDescription({ description }: EventDescriptionProps) {
    return (
        <div className="mt-6 pt-4 border-t border-border">
            <div className="text-sm font-medium mb-2">Description</div>
            <div className="text-sm text-muted-foreground bg-muted/10 p-3 rounded-md">{description}</div>
        </div>
    );
}
