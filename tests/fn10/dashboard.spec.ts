import { describe, expect, it } from 'vitest';
import {
  getDashboardStats,
  recordStudyActivity,
} from '../../src/fn10_dashboard_hoc_tap/application/dashboardUseCases';
import { createMockDashboardRepository } from '../../src/fn10_dashboard_hoc_tap/infrastructure/dashboardRepository';

describe('FN-10 Dashboard', () => {
  const repo = createMockDashboardRepository();
  const deviceId = 'dash-test';

  it('returns default stats', async () => {
    const r = await getDashboardStats(repo, deviceId);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.xp).toBe(0);
  });

  it('records study and increases xp', async () => {
    const r = await recordStudyActivity(repo, deviceId, 15);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.xp).toBeGreaterThanOrEqual(15);
      expect(r.value.streak).toBeGreaterThanOrEqual(1);
    }
  });
});
