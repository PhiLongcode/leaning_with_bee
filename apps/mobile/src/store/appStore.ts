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
  dbConnection: DatabaseConnectionState;
  dbChecking: boolean;
  setScreen: (screen: Screen) => void;
  setDeviceId: (id: string) => void;
  setDbConnection: (dbConnection: DatabaseConnectionState) => void;
  setDbChecking: (dbChecking: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  screen: 'splash',
  deviceId: null,
  streak: 0,
  xp: 0,
  dbConnection: initialDatabaseConnectionState,
  dbChecking: false,
  setScreen: (screen) => set({ screen }),
  setDeviceId: (deviceId) => set({ deviceId }),
  setDbConnection: (dbConnection) => set({ dbConnection }),
  setDbChecking: (dbChecking) => set({ dbChecking }),
}));
