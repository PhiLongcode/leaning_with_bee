import { ok, type Result } from '../../shared/result';
import { isDue } from '../../shared/srs';
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

      let reviewsDue = 0;
      const { data: dueRows, error: dueErr } = await fromTable(client, 'learning_progress')
        .select('next_review')
        .eq('device_id', deviceId)
        .limit(500);
      if (!dueErr && dueRows) {
        reviewsDue = (dueRows as { next_review: string | null }[]).filter((r) =>
          isDue(r.next_review),
        ).length;
      }

      const { data, error } = await fromTable(client, 'learner_stats')
        .select('streak, xp, words_learned_today')
        .eq('device_id', deviceId)
        .maybeSingle();
      if (error && isMissingTableError(error)) {
        remoteUnavailable = true;
        return mock.getStats(deviceId);
      }
      if (error || !data) {
        return ok({ ...defaultStats(), reviewsDue });
      }
      const row = data as Record<string, unknown>;
      return ok({
        streak: Number(row.streak ?? 0),
        xp: Number(row.xp ?? 0),
        wordsLearnedToday: Number(row.words_learned_today ?? 0),
        reviewsDue,
      });
    },
    async recordStudy(deviceId, xpGain) {
      if (remoteUnavailable) return mock.recordStudy(deviceId, xpGain);

      const { data: existing } = await fromTable(client, 'learner_stats')
        .select('streak, xp, words_learned_today, last_study_date')
        .eq('device_id', deviceId)
        .maybeSingle();

      const today = new Date().toISOString().slice(0, 10);
      const row = (existing ?? {}) as Record<string, unknown>;
      const lastDate = row.last_study_date != null ? String(row.last_study_date).slice(0, 10) : null;
      const prevStreak = Number(row.streak ?? 0);
      const streak = lastDate === today ? prevStreak : prevStreak + 1;
      const next = {
        streak,
        xp: Number(row.xp ?? 0) + xpGain,
        wordsLearnedToday:
          lastDate === today ? Number(row.words_learned_today ?? 0) + 1 : 1,
      };

      const { error } = await fromTable(client, 'learner_stats').upsert({
        device_id: deviceId,
        streak: next.streak,
        xp: next.xp,
        words_learned_today: next.wordsLearnedToday,
        last_study_date: today,
      });
      if (error && isMissingTableError(error)) {
        remoteUnavailable = true;
        return mock.recordStudy(deviceId, xpGain);
      }

      const full = await this.getStats(deviceId);
      if (full.ok) return full;
      return ok({ ...next, reviewsDue: 0 });
    },
  };
}
