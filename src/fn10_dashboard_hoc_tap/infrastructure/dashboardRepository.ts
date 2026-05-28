import { ok, type Result } from '../../shared/result';
import { isMissingTableError } from '../../shared/supabaseErrors';
import { fromTable, type SupabaseLikeClient } from '../../shared/supabaseClient';
import type { DashboardStats } from '../domain/dashboard';

export type DashboardRepository = {
  getStats(deviceId: string): Promise<Result<DashboardStats>>;
  recordStudy(deviceId: string, xpGain: number): Promise<Result<DashboardStats>>;
};

const mockStats = new Map<string, DashboardStats>();

function defaultStats(): DashboardStats {
  return { streak: 0, xp: 0, wordsLearnedToday: 0, reviewsDue: 0 };
}

export function createMockDashboardRepository(): DashboardRepository {
  return {
    async getStats(deviceId) {
      return ok(mockStats.get(deviceId) ?? defaultStats());
    },
    async recordStudy(deviceId, xpGain) {
      const prev = mockStats.get(deviceId) ?? defaultStats();
      const today = new Date().toISOString().slice(0, 10);
      const next: DashboardStats = {
        streak: prev.streak + 1,
        xp: prev.xp + xpGain,
        wordsLearnedToday: prev.wordsLearnedToday + 1,
        reviewsDue: Math.max(0, prev.reviewsDue - 1),
      };
      mockStats.set(deviceId, next);
      void today;
      return ok(next);
    },
  };
}

export function createSupabaseDashboardRepository(client: SupabaseLikeClient): DashboardRepository {
  const mock = createMockDashboardRepository();
  let remoteUnavailable = false;

  return {
    async getStats(deviceId) {
      if (remoteUnavailable) return mock.getStats(deviceId);
      const { data, error } = await fromTable(client, 'learner_stats')
        .select('streak, xp, words_learned_today')
        .eq('device_id', deviceId)
        .maybeSingle();
      if (error && isMissingTableError(error)) {
        remoteUnavailable = true;
        return mock.getStats(deviceId);
      }
      if (error || !data) return mock.getStats(deviceId);
      const row = data as Record<string, unknown>;
      return ok({
        streak: Number(row.streak ?? 0),
        xp: Number(row.xp ?? 0),
        wordsLearnedToday: Number(row.words_learned_today ?? 0),
        reviewsDue: 0,
      });
    },
    async recordStudy(deviceId, xpGain) {
      const stats = await mock.recordStudy(deviceId, xpGain);
      if (!stats.ok || remoteUnavailable) return stats;
      const { error } = await fromTable(client, 'learner_stats')
        .upsert({
          device_id: deviceId,
          streak: stats.value.streak,
          xp: stats.value.xp,
          words_learned_today: stats.value.wordsLearnedToday,
          last_study_date: new Date().toISOString().slice(0, 10),
        })
        .select('streak, xp, words_learned_today')
        .single();
      if (error && isMissingTableError(error)) remoteUnavailable = true;
      return stats;
    },
  };
}
