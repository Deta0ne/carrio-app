'use client';
import { useCounterStore } from '@/providers/app-provider';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
export const HomePage = () => {
    const { count, incrementCount, decrementCount } = useCounterStore((state) => state);

    return (
        <div className="flex flex-col items-center justify-center h-screenq">
            Count: {count}
            <hr />
            <button type="button" onClick={incrementCount}>
                Increment Count
            </button>
            <button type="button" onClick={decrementCount}>
                Decrement Count
            </button>
            <br />
            <Button>Button</Button>
        </div>
    );
};
