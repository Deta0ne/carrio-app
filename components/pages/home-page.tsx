'use client';
import { useCounterStore } from '@/providers/app-provider';

export const HomePage = () => {
    const { count, incrementCount, decrementCount } = useCounterStore((state) => state);

    return (
        <div>
            Count: {count}
            <hr />
            <button type="button" onClick={incrementCount}>
                Increment Count
            </button>
            <button type="button" onClick={decrementCount}>
                Decrement Count
            </button>
        </div>
    );
};
