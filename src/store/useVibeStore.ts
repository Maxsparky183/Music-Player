import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Track } from '../types';
import { Theme } from './usePreferencesStore';

export interface VibeSession { id: string; name: string; queue: Track[]; volume: number; theme: Theme; }

interface VibeStore { sessions: VibeSession[]; saveSession: (session: Omit<VibeSession, 'id'>) => void; removeSession: (id: string) => void; }

export const useVibeStore = create<VibeStore>()(persist((set) => ({
  sessions: [],
  saveSession: (session) => set((state) => ({ sessions: [{ ...session, id: crypto.randomUUID() }, ...state.sessions.filter((item) => item.name !== session.name)].slice(0, 12) })),
  removeSession: (id) => set((state) => ({ sessions: state.sessions.filter((item) => item.id !== id) }))
}), { name: 'vibe-sessions' }));
