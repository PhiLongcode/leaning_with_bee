import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_APP_SYSTEM_CONFIG,
  getAppSystemConfig,
  type AppSystemConfig,
} from '@hoc-cung-bee/features';
import { isSupabaseConfigured } from '../config/env';
import { getSystemConfigRepository } from './featureRepos';

const CACHE_KEY = '@cuder/app_system_config_v1';

export async function loadCachedSystemConfig(): Promise<AppSystemConfig | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppSystemConfig;
  } catch {
    return null;
  }
}

async function saveCachedSystemConfig(config: AppSystemConfig): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(config));
}

export async function fetchSystemConfig(): Promise<AppSystemConfig> {
  const cached = await loadCachedSystemConfig();
  const fallback = cached ?? DEFAULT_APP_SYSTEM_CONFIG;

  if (!isSupabaseConfigured) {
    return fallback;
  }

  const result = await getAppSystemConfig(getSystemConfigRepository());
  if (!result.ok) {
    return fallback;
  }

  await saveCachedSystemConfig(result.value);
  return result.value;
}
