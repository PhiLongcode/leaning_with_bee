import type { SupabaseClient } from '@supabase/supabase-js';

/** Đồng bộ profiles.device_id sau anonymous auth (trigger cũng chạy trên insert). */
export async function ensureProfile(
  supabase: SupabaseClient,
  deviceId: string,
): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return;

  const { error } = await supabase.from('profiles').upsert(
    { id: user.id, device_id: deviceId },
    { onConflict: 'id' },
  );

  if (error) console.warn('ensureProfile:', error.message);
}
