'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { CalendarEvent, JobApplication } from '@/types/calendar';
import {
    EventHeader,
    EventDateInfo,
    EventTypeInfo,
    EventStatusInfo,
    EventDescription,
} from './event-details-components';
import { cn } from '@/lib/utils';

interface EventDetailsProps {
    event: CalendarEvent;
    onClose: () => void;
    applications: JobApplication[];
}

export function EventDetails({ event, onClose, applications }: EventDetailsProps) {
    const application = applications.find((app) => app.id === event.applicationId);

    const eventDescription = application
        ? `Interview for ${application.position} position at ${application.company_name}`
        : 'No additional details available';

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
            <Card className="w-full max-w-md border-border shadow-lg overflow-hidden bg-gradient-to-b from-card to-card/95">
                <div className="w-full h-2 bg-[linear-gradient(to_right,#34e89e,#0f3443)]" />

                <EventHeader event={event} application={application} onClose={onClose} />

                <CardContent className="pb-6">
                    <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-4">
                        {/* Date */}
                        <EventDateInfo date={event.date} />

                        {/* Event Type */}
                        <EventTypeInfo type={event.type} />

                        {/* Application Status (if application is available) */}
                        {application && (
                            <EventStatusInfo
                                status={application.status}
                                applicationDate={application.application_date}
                            />
                        )}
                    </div>

                    {/* Description */}
                    <EventDescription description={eventDescription} />
                </CardContent>

                <CardFooter className="pt-0 flex gap-2">
                    <Button
                        variant="outline"
                        className={cn(
                            'flex-1 border-[#34e89e]/30 hover:bg-[#0f3443]/10 hover:text-[#34e89e]',
                            'transition-colors',
                        )}
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
