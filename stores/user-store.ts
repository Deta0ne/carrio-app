import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/services/profile-service';
interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
    profile: Profile | null;
    setProfile: (profile: Profile | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    profile: null,
    setProfile: (profile) => set({ profile }),
}));