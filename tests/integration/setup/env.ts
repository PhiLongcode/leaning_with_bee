import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** Local dev: map EXPO_PUBLIC_* từ apps/mobile/.env.development nếu chưa set TEST_*. */
function loadMobileDevEnv(): void {
  const path = resolve(process.cwd(), 'apps/mobile/.env.development');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([^#=\s]+)=(.*)$/);
    if (!m) continue;
    const key = m[1]!.trim();
    const val = m[2]!.trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadMobileDevEnv();

export type TestEnv = {
  supabaseUrl: string;
  anonKey: string;
  deviceId: string;
  configured: boolean;
};

export function getTestEnv(): TestEnv {
  const supabaseUrl =
    process.env.TEST_SUPABASE_URL?.trim() ||
    process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ||
    '';
  const anonKey =
    process.env.TEST_SUPABASE_ANON_KEY?.trim() ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    '';
  const deviceId =
    process.env.TEST_DEVICE_ID?.trim() || `test-api-${Date.now().toString(36)}`;

  return {
    supabaseUrl,
    anonKey,
    deviceId,
    configured: Boolean(supabaseUrl && anonKey && !supabaseUrl.includes('placeholder')),
  };
}
