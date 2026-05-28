export type { DashboardStats } from './domain/dashboard';
export { getDashboardStats, recordStudyActivity } from './application/dashboardUseCases';
export {
  createMockDashboardRepository,
  createSupabaseDashboardRepository,
  type DashboardRepository,
} from './infrastructure/dashboardRepository';
