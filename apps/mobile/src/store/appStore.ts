import { create } from 'zustand';
import type { Screen } from '../navigation/screens';

export type { Screen } from '../navigation/screens';

type AppState = {
  screen: Screen;
  deviceId: string | null;
  streak: number;
  xp: number;
  setScreen: (screen: Screen) => void;
  setDeviceId: (id: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  screen: 'splash',
  deviceId: null,
  streak: 0,
  xp: 0,
  setScreen: (screen) => set({ screen }),
  setDeviceId: (deviceId) => set({ deviceId }),
}));
