import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import ws from 'ws';
import type { SupabaseLikeClient } from '../../../src/shared/supabaseClient';
import { getTestEnv } from './env';

export type IntegrationContext = {
  client: SupabaseClient;
  asRepo: SupabaseLikeClient;
  deviceId: string;
  accessToken: string;
};

let sharedContext: IntegrationContext | null = null;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resolveSession(
  client: SupabaseClient,
): Promise<{ accessToken: string; userId?: string }> {
  const preset = process.env.TEST_SUPABASE_ACCESS_TOKEN?.trim();
  if (preset) {
    const { data, error } = await client.auth.setSession({
      access_token: preset,
      refresh_token: process.env.TEST_SUPABASE_REFRESH_TOKEN?.trim() || '',
    });
    if (error || !data.session?.access_token) {
      throw new Error(`setSession failed: ${error?.message ?? 'no session'}`);
    }
    return { accessToken: data.session.access_token, userId: data.user?.id };
  }

  const maxAttempts = 4;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { data, error } = await client.auth.signInAnonymously();
    if (!error && data.session?.access_token) {
      return { accessToken: data.session.access_token, userId: data.user?.id };
    }
    const rateLimited = error?.message?.toLowerCase().includes('rate limit');
    if (rateLimited && attempt < maxAttempts - 1) {
      await sleep(1500 * (attempt + 1));
      continue;
    }
    throw new Error(`signInAnonymously failed: ${error?.message ?? 'no session'}`);
  }

  throw new Error('signInAnonymously failed: exhausted retries');
}

/** Một session cho cả worker — tránh rate-limit `signInAnonymously`. */
export async function getIntegrationContext(): Promise<IntegrationContext> {
  if (sharedContext) return sharedContext;
  sharedContext = await createIntegrationContext();
  return sharedContext;
}

export async function createIntegrationContext(): Promise<IntegrationContext> {
  const env = getTestEnv();
  if (!env.configured) {
    throw new Error('Thiếu TEST_SUPABASE_URL / TEST_SUPABASE_ANON_KEY (hoặc EXPO_PUBLIC_*)');
  }

  const client = createClient(env.supabaseUrl, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { transport: ws },
  });

  const { accessToken, userId } = await resolveSession(client);

  if (userId) {
    await client.from('profiles').upsert({
      id: userId,
      device_id: env.deviceId,
    });
  }

  return {
    client,
    asRepo: client as unknown as SupabaseLikeClient,
    deviceId: env.deviceId,
    accessToken,
  };
}
