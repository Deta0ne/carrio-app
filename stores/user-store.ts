import { createStore } from 'zustand/vanilla';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/services/profile-service';

interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
    profile: Profile | null;
    setProfile: (profile: Profile | null) => void;
}

interface UserActions {
    setUser: (user: User | null) => void;
    setProfile: (profile: Profile | null) => void;
}

export type UserStore = UserState & UserActions;

const defaultState: UserState = {
    user: null,
    profile: null,
    setUser: () => {},
    setProfile: () => {},
};

export const createUserStore = (initState: UserState = defaultState) => {
    return createStore<UserStore>()((set) => ({
        ...initState,
        setUser: (user) => set({ user }),
        setProfile: (profile) => set({ profile }),
    }));
};