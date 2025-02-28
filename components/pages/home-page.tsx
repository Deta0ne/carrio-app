'use client';
import { useCounterStore } from '@/providers/app-provider';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import JobBoard from '@/components/ApplicationCard';

export const HomePage = () => {
    const { count, incrementCount, decrementCount } = useCounterStore((state) => state);

    return <div className="flex flex-col items-center justify-center h-screenq"></div>;
};
