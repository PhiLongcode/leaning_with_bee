import { ok, type Result } from '../../shared/result';
import { isMissingTableError } from '../../shared/supabaseErrors';
import { fromTable, type SupabaseLikeClient } from '../../shared/supabaseClient';
import {
  DEFAULT_APP_SYSTEM_CONFIG,
  mapPermissionsJson,
  type AppSystemConfig,
} from '../domain/systemConfig';

export type SystemConfigRepository = {
  getAppSystemConfig(): Promise<Result<AppSystemConfig>>;
};

function mapRow(row: Record<string, unknown>): AppSystemConfig {
  return {
    permissions: mapPermissionsJson(row.permissions),
    updatedAt: row.updated_at != null ? String(row.updated_at) : null,
  };
}

export function createMockSystemConfigRepository(
  config: AppSystemConfig = DEFAULT_APP_SYSTEM_CONFIG,
): SystemConfigRepository {
  return {
    async getAppSystemConfig() {
      return ok(config);
    },
  };
}

export function createSupabaseSystemConfigRepository(
  client: SupabaseLikeClient,
): SystemConfigRepository {
  const mock = createMockSystemConfigRepository();
  let remoteUnavailable = false;

  return {
    async getAppSystemConfig() {
      if (remoteUnavailable) {
        return mock.getAppSystemConfig();
      }

      const { data, error } = await fromTable(client, 'app_system_config')
        .select('permissions, updated_at')
        .eq('id', 1)
        .maybeSingle();

      if (error && isMissingTableError(error)) {
        remoteUnavailable = true;
        return mock.getAppSystemConfig();
      }

      if (error || !data) {
        return mock.getAppSystemConfig();
      }

      return ok(mapRow(data as Record<string, unknown>));
    },
  };
}
