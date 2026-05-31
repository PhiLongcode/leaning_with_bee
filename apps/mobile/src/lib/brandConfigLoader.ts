import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_APP_BRAND_CONFIG,
  getAppBrandConfig,
  resolveLogoUrl,
  type AppBrandConfig,
} from '@hoc-cung-bee/features';
import { env, isSupabaseConfigured } from '../config/env';
import { getBrandConfigRepository } from './featureRepos';

const CACHE_KEY = '@cuder/app_brand_config_v2';

export type BrandRuntime = AppBrandConfig & {
  resolvedLogoUrl: string | null;
};

function toRuntime(config: AppBrandConfig, supabaseUrl: string): BrandRuntime {
  return {
    ...config,
    resolvedLogoUrl: resolveLogoUrl(config, supabaseUrl),
  };
}

export async function loadCachedBrandConfig(): Promise<BrandRuntime | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppBrandConfig;
    return toRuntime(parsed, env.supabaseUrl);
  } catch {
    return null;
  }
}

async function saveCachedBrandConfig(config: AppBrandConfig): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(config));
}

export async function fetchBrandConfig(): Promise<BrandRuntime> {
  const cached = await loadCachedBrandConfig();
  const fallback = toRuntime(
    cached ?? DEFAULT_APP_BRAND_CONFIG,
    env.supabaseUrl,
  );

  if (!isSupabaseConfigured) {
    return fallback;
  }

  const result = await getAppBrandConfig(getBrandConfigRepository(), env.supabaseUrl);
  if (!result.ok) {
    return fallback;
  }

  await saveCachedBrandConfig(result.value);
  return toRuntime(result.value, env.supabaseUrl);
}
