import { create } from 'zustand';
import type { Screen } from '../navigation/screens';
import {
  initialDatabaseConnectionState,
  type DatabaseConnectionState,
} from '../lib/checkDatabaseConnection';

export type { Screen } from '../navigation/screens';

type AppState = {
  screen: Screen;
  deviceId: string | null;
  streak: number;
  xp: number;
  lessonDay: number;
  dbConnection: DatabaseConnectionState;
  dbChecking: boolean;
  setScreen: (screen: Screen) => void;
  setDeviceId: (id: string) => void;
  setDbConnection: (dbConnection: DatabaseConnectionState) => void;
  setDbChecking: (dbChecking: boolean) => void;
  applyGamification: (stats: { streak: number; xp: number }) => void;
  addXp: (amount: number) => void;
  setLessonDay: (day: number) => void;
};

export const useAppStore = create<AppState>((set) => ({
  screen: 'splash',
  deviceId: null,
  streak: 0,
  xp: 0,
  lessonDay: 1,
  dbConnection: initialDatabaseConnectionState,
  dbChecking: false,
  setScreen: (screen) => set({ screen }),
  setDeviceId: (deviceId) => set({ deviceId }),
  setDbConnection: (dbConnection) => set({ dbConnection }),
  setDbChecking: (dbChecking) => set({ dbChecking }),
  applyGamification: ({ streak, xp }) => set({ streak, xp }),
  addXp: (amount) => set((s) => ({ xp: s.xp + amount })),
  setLessonDay: (lessonDay) => set({ lessonDay: Math.min(7, Math.max(1, lessonDay)) }),
}));
