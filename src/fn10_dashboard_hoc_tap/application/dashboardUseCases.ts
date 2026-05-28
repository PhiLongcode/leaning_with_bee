import type { DashboardStats } from '../domain/dashboard';
import type { DashboardRepository } from '../infrastructure/dashboardRepository';
import type { Result } from '../../shared/result';

export function getDashboardStats(
  repo: DashboardRepository,
  deviceId: string,
): Promise<Result<DashboardStats>> {
  return repo.getStats(deviceId);
}

export function recordStudyActivity(
  repo: DashboardRepository,
  deviceId: string,
  xpGain: number,
): Promise<Result<DashboardStats>> {
  return repo.recordStudy(deviceId, xpGain);
}
