export interface CalendarEvent {
    id: string;
    applicationId: string;
    title: string;
    date: Date;
    type: 'interview';
}

export interface JobApplication {
    id: string;
    company_name: string;
    position: string;
    status: string;
    application_date: string;
    interview_date: string;
    user_id: string;
}
export interface EventHeaderProps {
    event: CalendarEvent;
    application?: JobApplication;
    onClose: () => void;
}

export interface EventInfoItemProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}
export interface EventDateInfoProps {
    date: Date;
}

export interface EventTypeInfoProps {
    type: string;
}

export interface EventStatusInfoProps {
    status: string;
    applicationDate: string;
}

export interface EventDescriptionProps {
    description: string;
}
export interface CalendarEventProps {
    event: CalendarEvent;
    onClick: () => void;
}
export interface CalendarDayProps {
    day: number;
    events: CalendarEvent[];
    isCurrentMonth?: boolean;
    isTodayDate?: boolean;
    onEventClick: (event: CalendarEvent) => void;
}

export interface CalendarHeaderProps {
    monthString: string;
    yearString: string;
    daysInMonth: number;
    eventCount: number;
    isCurrentMonth: boolean;
    goToPrevMonth: () => void;
    goToToday: () => void;
    goToNextMonth: () => void;
}
