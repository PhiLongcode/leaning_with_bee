import { createClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from '../config/env';

export { isSupabaseConfigured } from '../config/env';

export const supabase = createClient(
  env.supabaseUrl || 'https://placeholder.supabase.co',
  env.supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
