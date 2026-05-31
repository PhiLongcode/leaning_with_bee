import { create } from 'zustand';
import {
  DEFAULT_APP_SYSTEM_PERMISSIONS,
  type AppSystemPermissions,
} from '@hoc-cung-bee/features';

type PermissionsState = {
  permissions: AppSystemPermissions;
  loading: boolean;
  setPermissions: (permissions: AppSystemPermissions) => void;
  setLoading: (loading: boolean) => void;
};

export const usePermissionsStore = create<PermissionsState>((set) => ({
  permissions: DEFAULT_APP_SYSTEM_PERMISSIONS,
  loading: true,
  setPermissions: (permissions) => set({ permissions, loading: false }),
  setLoading: (loading) => set({ loading }),
}));

export function useAppPermissions(): AppSystemPermissions {
  return usePermissionsStore((s) => s.permissions);
}
