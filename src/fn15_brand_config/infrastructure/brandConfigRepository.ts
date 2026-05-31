import { ok, type Result } from '../../shared/result';
import { isMissingTableError } from '../../shared/supabaseErrors';
import { fromTable, type SupabaseLikeClient } from '../../shared/supabaseClient';
import {
  DEFAULT_APP_BRAND_CONFIG,
  resolveLogoUrl,
  type AppBrandConfig,
} from '../domain/brandConfig';

export type BrandConfigRepository = {
  getAppBrandConfig(supabasePublicUrl: string): Promise<Result<AppBrandConfig>>;
};

function mapRow(row: Record<string, unknown>): AppBrandConfig {
  return {
    brandName: String(row.brand_name ?? DEFAULT_APP_BRAND_CONFIG.brandName),
    brandTagline: String(row.brand_tagline ?? DEFAULT_APP_BRAND_CONFIG.brandTagline),
    brandSubtitle: row.brand_subtitle != null ? String(row.brand_subtitle) : null,
    logoUrl: row.logo_url != null ? String(row.logo_url) : null,
    logoStoragePath:
      row.logo_storage_path != null ? String(row.logo_storage_path) : null,
    brandPrimaryHex: String(row.brand_primary_hex ?? DEFAULT_APP_BRAND_CONFIG.brandPrimaryHex),
    brandPrimaryLightHex:
      row.brand_primary_light_hex != null ? String(row.brand_primary_light_hex) : null,
    updatedAt: row.updated_at != null ? String(row.updated_at) : null,
  };
}

export function createMockBrandConfigRepository(
  config: AppBrandConfig = DEFAULT_APP_BRAND_CONFIG,
): BrandConfigRepository {
  return {
    async getAppBrandConfig(supabasePublicUrl) {
      return ok({
        ...config,
        logoUrl: resolveLogoUrl(config, supabasePublicUrl),
      });
    },
  };
}

export function createSupabaseBrandConfigRepository(
  client: SupabaseLikeClient,
): BrandConfigRepository {
  const mock = createMockBrandConfigRepository();
  let remoteUnavailable = false;

  return {
    async getAppBrandConfig(supabasePublicUrl) {
      if (remoteUnavailable) {
        return mock.getAppBrandConfig(supabasePublicUrl);
      }

      const { data, error } = await fromTable(client, 'app_brand_config')
        .select(
          'brand_name, brand_tagline, brand_subtitle, logo_url, logo_storage_path, brand_primary_hex, brand_primary_light_hex, updated_at',
        )
        .eq('id', 1)
        .maybeSingle();

      if (error && isMissingTableError(error)) {
        remoteUnavailable = true;
        return mock.getAppBrandConfig(supabasePublicUrl);
      }

      if (error || !data) {
        return mock.getAppBrandConfig(supabasePublicUrl);
      }

      const mapped = mapRow(data as Record<string, unknown>);
      return ok({
        ...mapped,
        logoUrl: resolveLogoUrl(mapped, supabasePublicUrl),
      });
    },
  };
}
