import type { SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '../config/env';

export type DatabaseConnectionStatus =
  | 'unchecked'
  | 'checking'
  | 'connected'
  | 'not_configured'
  | 'unreachable'
  | 'schema_missing'
  | 'auth_error'
  | 'error';

export type DatabaseConnectionState = {
  status: DatabaseConnectionStatus;
  message: string;
  checkedAt: string | null;
  vocabularyCount: number | null;
  projectRef: string | null;
};

export const initialDatabaseConnectionState: DatabaseConnectionState = {
  status: 'unchecked',
  message: 'Chưa kiểm tra',
  checkedAt: null,
  vocabularyCount: null,
  projectRef: null,
};

function isSchemaMissingError(message: string): boolean {
  return message.includes('PGRST205') || message.includes("Could not find the table");
}

export async function checkDatabaseConnection(
  client: SupabaseClient,
  projectRef: string | null,
): Promise<DatabaseConnectionState> {
  const checkedAt = new Date().toISOString();

  if (!isSupabaseConfigured) {
    return {
      status: 'not_configured',
      message: 'Thiếu EXPO_PUBLIC_SUPABASE_URL hoặc ANON_KEY trong file .env',
      checkedAt,
      vocabularyCount: null,
      projectRef,
    };
  }

  const { count, error } = await client
    .from('vocabulary')
    .select('id', { count: 'exact', head: true });

  if (error) {
    const msg = error.message ?? 'Unknown error';
    if (isSchemaMissingError(msg)) {
      return {
        status: 'schema_missing',
        message: 'Chưa có bảng vocabulary — chạy supabase/apply-all.sql hoặc npm run db:push',
        checkedAt,
        vocabularyCount: null,
        projectRef,
      };
    }
    if (error.code === '401' || msg.toLowerCase().includes('jwt')) {
      return {
        status: 'auth_error',
        message: `Lỗi xác thực: ${msg}`,
        checkedAt,
        vocabularyCount: null,
        projectRef,
      };
    }
    return {
      status: 'unreachable',
      message: msg,
      checkedAt,
      vocabularyCount: null,
      projectRef,
    };
  }

  const vocabularyCount = count ?? 0;
  return {
    status: 'connected',
    message:
      vocabularyCount > 0
        ? `Đã kết nối — ${vocabularyCount} từ trong catalog`
        : 'Đã kết nối — bảng vocabulary trống (chạy seed)',
    checkedAt,
    vocabularyCount,
    projectRef,
  };
}
