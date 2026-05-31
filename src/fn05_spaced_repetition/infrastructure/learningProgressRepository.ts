import { DAILY_VOCABULARY_SEED } from '../../fn01_hoc_tu_vung_ngu_canh/data/dailyVocabularySeed';
import type { Vocabulary } from '../../fn01_hoc_tu_vung_ngu_canh/domain/vocabulary';
import { ok, type Result } from '../../shared/result';
import { isDue, scheduleAfterReview, type ReviewRating } from '../../shared/srs';
import { fromTable, type SupabaseLikeClient } from '../../shared/supabaseClient';
import type { LearningProgress } from '../domain/learningProgress';

export type ProgressWithVocab = LearningProgress & { vocabulary?: Vocabulary };

export type LearningProgressRepository = {
  listDue(deviceId: string): Promise<Result<ProgressWithVocab[]>>;
  ensureEnrolled(deviceId: string, vocabId: string): Promise<Result<LearningProgress>>;
  submitReview(
    deviceId: string,
    vocabId: string,
    rating: ReviewRating,
  ): Promise<Result<LearningProgress>>;
};

const mockStore = new Map<string, LearningProgress>();

function key(deviceId: string, vocabId: string) {
  return `${deviceId}:${vocabId}`;
}

function mapRow(row: Record<string, unknown>): LearningProgress {
  return {
    id: String(row.id),
    deviceId: String(row.device_id ?? row.deviceId),
    vocabId: String(row.vocab_id ?? row.vocabId),
    repetitionLevel: Number(row.repetition_level ?? row.repetitionLevel ?? 0),
    nextReview: row.next_review != null ? String(row.next_review) : null,
    accuracy: row.accuracy != null ? Number(row.accuracy) : null,
    reviewCount: Number(row.review_count ?? row.reviewCount ?? 0),
  };
}

function withVocab(p: LearningProgress): ProgressWithVocab {
  return { ...p, vocabulary: DAILY_VOCABULARY_SEED.find((v) => v.id === p.vocabId) };
}

export function createMockLearningProgressRepository(): LearningProgressRepository {
  for (const v of DAILY_VOCABULARY_SEED.slice(0, 10)) {
    const id = key('mock-device', v.id);
    mockStore.set(id, {
      id: `lp-${v.id}`,
      deviceId: 'mock-device',
      vocabId: v.id,
      repetitionLevel: 0,
      nextReview: null,
      accuracy: null,
      reviewCount: 0,
    });
  }
  return {
    async listDue(deviceId) {
      const all = [...mockStore.values()].filter((p) => p.deviceId === deviceId);
      const due = all.filter((p) => isDue(p.nextReview));
      if (!due.length) {
        return ok(DAILY_VOCABULARY_SEED.slice(0, 5).map((v) => withVocab({
          id: `lp-${v.id}`,
          deviceId,
          vocabId: v.id,
          repetitionLevel: 0,
          nextReview: null,
          accuracy: null,
          reviewCount: 0,
        })));
      }
      return ok(due.map(withVocab));
    },
    async ensureEnrolled(deviceId, vocabId) {
      const k = key(deviceId, vocabId);
      if (mockStore.has(k)) return ok(mockStore.get(k)!);
      const entry: LearningProgress = {
        id: `lp-${vocabId}`,
        deviceId,
        vocabId,
        repetitionLevel: 0,
        nextReview: new Date().toISOString(),
        accuracy: null,
        reviewCount: 0,
      };
      mockStore.set(k, entry);
      return ok(entry);
    },
    async submitReview(deviceId, vocabId, rating) {
      const k = key(deviceId, vocabId);
      const prev = mockStore.get(k) ?? {
        id: `lp-${vocabId}`,
        deviceId,
        vocabId,
        repetitionLevel: 0,
        nextReview: null,
        accuracy: null,
        reviewCount: 0,
      };
      const scheduled = scheduleAfterReview(rating, prev.repetitionLevel);
      const next: LearningProgress = {
        ...prev,
        ...scheduled,
        reviewCount: prev.reviewCount + 1,
        accuracy: rating === 'again' ? 0 : rating === 'good' || rating === 'easy' ? 1 : 0.5,
      };
      mockStore.set(k, next);
      return ok(next);
    },
  };
}

export function createSupabaseLearningProgressRepository(
  client: SupabaseLikeClient,
): LearningProgressRepository {
  const mock = createMockLearningProgressRepository();
  return {
    async listDue(deviceId) {
      const { data, error } = await fromTable(client, 'learning_progress')
        .select('id, device_id, vocab_id, repetition_level, next_review, accuracy, review_count')
        .eq('device_id', deviceId)
        .limit(200);
      if (error) return mock.listDue(deviceId);
      const rows = ((data ?? []) as Record<string, unknown>[]).map(mapRow).filter((p) =>
        isDue(p.nextReview),
      );
      if (!rows.length) return mock.listDue(deviceId);
      return ok(rows.map(withVocab));
    },
    async ensureEnrolled(deviceId, vocabId) {
      const existing = await fromTable(client, 'learning_progress')
        .select('id, device_id, vocab_id, repetition_level, next_review, accuracy, review_count')
        .eq('device_id', deviceId)
        .eq('vocab_id', vocabId)
        .maybeSingle();
      if (!existing.error && existing.data) return ok(mapRow(existing.data as Record<string, unknown>));
      const scheduled = scheduleAfterReview('good', 0);
      const { data, error } = await fromTable(client, 'learning_progress')
        .upsert({
          device_id: deviceId,
          vocab_id: vocabId,
          repetition_level: scheduled.repetitionLevel,
          next_review: scheduled.nextReview ?? new Date().toISOString(),
          review_count: 0,
        })
        .select('id, device_id, vocab_id, repetition_level, next_review, accuracy, review_count')
        .single();
      if (error) return mock.ensureEnrolled(deviceId, vocabId);
      return ok(mapRow(data!));
    },
    async submitReview(deviceId, vocabId, rating) {
      const scheduled = scheduleAfterReview(rating, 0);
      const { data, error } = await fromTable(client, 'learning_progress')
        .upsert({
          device_id: deviceId,
          vocab_id: vocabId,
          repetition_level: scheduled.repetitionLevel,
          next_review: scheduled.nextReview,
          review_count: 1,
        })
        .select('id, device_id, vocab_id, repetition_level, next_review, accuracy, review_count')
        .single();
      if (error) return mock.submitReview(deviceId, vocabId, rating);
      return ok(mapRow(data!));
    },
  };
}
