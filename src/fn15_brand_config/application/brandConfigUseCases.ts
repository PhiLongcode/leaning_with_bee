import type { AppBrandConfig } from '../domain/brandConfig';
import type { BrandConfigRepository } from '../infrastructure/brandConfigRepository';
import type { Result } from '../../shared/result';

export async function getAppBrandConfig(
  repo: BrandConfigRepository,
  supabasePublicUrl: string,
): Promise<Result<AppBrandConfig>> {
  return repo.getAppBrandConfig(supabasePublicUrl);
}
