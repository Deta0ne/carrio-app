'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import { type CounterStore, createCounterStore } from '@/stores/counter-store';
import { type UserStore, createUserStore } from '@/stores/user-store';

export type CounterStoreApi = ReturnType<typeof createCounterStore>;
export type UserStoreApi = ReturnType<typeof createUserStore>;

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(undefined);
export const UserStoreContext = createContext<UserStoreApi | undefined>(undefined);

export interface StoreProviderProps {
    children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
    const storeRef = useRef<CounterStoreApi>(null);
    const userStoreRef = useRef<UserStoreApi>(undefined);
    if (!storeRef.current) {
        storeRef.current = createCounterStore();
        userStoreRef.current = createUserStore();
    }

    return (
        <CounterStoreContext.Provider value={storeRef.current}>
            <UserStoreContext.Provider value={userStoreRef.current}>{children}</UserStoreContext.Provider>
        </CounterStoreContext.Provider>
    );
};

export const useCounterStore = <T,>(selector: (store: CounterStore) => T): T => {
    const counterStoreContext = useContext(CounterStoreContext);

    if (!counterStoreContext) {
        throw new Error(`useCounterStore must be used within AppProvider`);
    }

    return useStore(counterStoreContext, selector);
};

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
    const userStoreContext = useContext(UserStoreContext);

    if (!userStoreContext) {
        throw new Error(`useUserStore must be used within AppProvider`);
    }

    return useStore(userStoreContext, selector);
};
