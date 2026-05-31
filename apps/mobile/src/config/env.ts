export type AppEnv = 'development' | 'production';

const PLACEHOLDER_MARKERS = ['YOUR_PROJECT', 'your-anon', 'placeholder'];

function readAppEnv(): AppEnv {
  const raw = (process.env.EXPO_PUBLIC_APP_ENV ?? 'development').toLowerCase();
  return raw === 'production' ? 'production' : 'development';
}

function projectRefFromUrl(url: string): string | null {
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match?.[1] ?? null;
}

function isPlaceholder(value: string): boolean {
  if (!value.trim()) return true;
  return PLACEHOLDER_MARKERS.some((m) => value.includes(m));
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const appEnv = readAppEnv();
export const isDev = appEnv === 'development';
export const isProd = appEnv === 'production';

export const env = {
  appEnv,
  isDev,
  isProd,
  appName: process.env.EXPO_PUBLIC_APP_NAME ?? 'Cuder học tiếng Anh',
  supabaseUrl,
  supabaseAnonKey,
  projectRef: projectRefFromUrl(supabaseUrl),
} as const;

export const isSupabaseConfigured =
  !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseAnonKey);

/** Hiển thị secret rút gọn trên màn Cài đặt (không chỉnh sửa được trong app). */
export function maskSecret(value: string, head = 12): string {
  if (!value.trim()) return '—';
  if (value.length <= head) return `${value.slice(0, 4)}…`;
  return `${value.slice(0, head)}…`;
}
