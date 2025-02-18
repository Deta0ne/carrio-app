'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import { type CounterStore, createCounterStore } from '@/stores/counter-store';

export type CounterStoreApi = ReturnType<typeof createCounterStore>;

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(undefined);

export interface AppProviderProps {
    // Sadece bu isim değişti
    children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    // Sadece bu isim değişti
    const storeRef = useRef<CounterStoreApi>(null);
    if (!storeRef.current) {
        storeRef.current = createCounterStore();
    }

    return <CounterStoreContext.Provider value={storeRef.current}>{children}</CounterStoreContext.Provider>;
};

export const useCounterStore = <T,>(selector: (store: CounterStore) => T): T => {
    const counterStoreContext = useContext(CounterStoreContext);

    if (!counterStoreContext) {
        throw new Error(`useCounterStore must be used within AppProvider`); // Error mesajı güncellendi
    }

    return useStore(counterStoreContext, selector);
};
