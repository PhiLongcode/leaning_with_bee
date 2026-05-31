import { create } from 'zustand';
import type { BrandRuntime } from '../lib/brandConfigLoader';
import { DEFAULT_APP_BRAND_CONFIG, resolveLogoUrl } from '@hoc-cung-bee/features';
import { env } from '../config/env';

type BrandState = {
  config: BrandRuntime | null;
  loading: boolean;
  setBrand: (config: BrandRuntime) => void;
  setLoading: (loading: boolean) => void;
};

const initialRuntime = (): BrandRuntime => ({
  ...DEFAULT_APP_BRAND_CONFIG,
  resolvedLogoUrl: resolveLogoUrl(DEFAULT_APP_BRAND_CONFIG, env.supabaseUrl),
});

export const useBrandStore = create<BrandState>((set) => ({
  config: null,
  loading: true,
  setBrand: (config) => set({ config, loading: false }),
  setLoading: (loading) => set({ loading }),
}));

export function useBrandRuntime(): BrandRuntime {
  const config = useBrandStore((s) => s.config);
  return config ?? initialRuntime();
}
