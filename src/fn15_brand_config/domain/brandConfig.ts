export type AppBrandConfig = {
  brandName: string;
  brandTagline: string;
  brandSubtitle: string | null;
  logoUrl: string | null;
  logoStoragePath: string | null;
  brandPrimaryHex: string;
  brandPrimaryLightHex: string | null;
  updatedAt: string | null;
};

export const DEFAULT_APP_BRAND_CONFIG: AppBrandConfig = {
  brandName: 'Developer Cuder',
  brandTagline: 'APP HỌC TIẾNG ANH',
  brandSubtitle: 'ENGLISH LEARNING',
  logoUrl: null,
  logoStoragePath: 'logo/AvataApp.png',
  brandPrimaryHex: '#27AE60',
  brandPrimaryLightHex: '#E8F5E9',
  updatedAt: null,
};

export function resolveLogoUrl(
  config: Pick<AppBrandConfig, 'logoUrl' | 'logoStoragePath'>,
  supabasePublicUrl: string,
): string | null {
  const direct = config.logoUrl?.trim();
  if (direct) return direct;

  const path = config.logoStoragePath?.trim().replace(/^\//, '');
  if (!path || !supabasePublicUrl) return null;

  const base = supabasePublicUrl.replace(/\/$/, '');
  return `${base}/storage/v1/object/public/brand-assets/${path}`;
}
