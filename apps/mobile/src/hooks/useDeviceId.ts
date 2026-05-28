import { useAppStore } from '../store/appStore';

export function useDeviceId(): string {
  return useAppStore((s) => s.deviceId) ?? 'local-device';
}
