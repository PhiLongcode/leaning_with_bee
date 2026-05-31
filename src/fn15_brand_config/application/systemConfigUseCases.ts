import type { AppSystemConfig } from '../domain/systemConfig';
import type { SystemConfigRepository } from '../infrastructure/systemConfigRepository';
import type { Result } from '../../shared/result';

export async function getAppSystemConfig(
  repo: SystemConfigRepository,
): Promise<Result<AppSystemConfig>> {
  return repo.getAppSystemConfig();
}
