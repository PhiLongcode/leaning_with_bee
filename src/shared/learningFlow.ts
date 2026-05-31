/**
 * Luồng học chính (REQ-01 → FN-02/05/06/10) — orchestration cross-FN.
 *
 * 1. Học từ (FN-01) → ghi sổ (FN-02) + đăng ký ôn SRS (FN-05) + XP (FN-10)
 * 2. Context quiz (FN-06) → cập nhật SRS theo đúng/sai
 * 3. Ôn due (FN-05) → submitReview
 */
import { addVocabularyToMyList } from '../fn02_quan_ly_tu_vung_ca_nhan/application/userVocabularyUseCases';
import type { UserVocabularyRepository } from '../fn02_quan_ly_tu_vung_ca_nhan/infrastructure/userVocabularyRepository';
import { recordStudyActivity } from '../fn10_dashboard_hoc_tap/application/dashboardUseCases';
import type { DashboardRepository } from '../fn10_dashboard_hoc_tap/infrastructure/dashboardRepository';
import {
  enrollVocabularyForReview,
  submitReview,
} from '../fn05_spaced_repetition/application/spacedRepetitionUseCases';
import type { LearningProgressRepository } from '../fn05_spaced_repetition/infrastructure/learningProgressRepository';
import type { ReviewRating } from './srs';
import type { Result } from './result';

export type StudyWordDeps = {
  userVocabRepo: UserVocabularyRepository;
  progressRepo: LearningProgressRepository;
  dashboardRepo: DashboardRepository;
  deviceId: string;
  vocabId: string;
  xpGain?: number;
};

/** Sau khi học/xem xong một từ — sổ cá nhân + hàng đợi SRS + XP. */
export async function completeVocabularyStudyStep(
  deps: StudyWordDeps,
): Promise<Result<{ enrolled: boolean; addedToList: boolean }>> {
  const { userVocabRepo, progressRepo, dashboardRepo, deviceId, vocabId, xpGain = 5 } = deps;

  const added = await addVocabularyToMyList(userVocabRepo, deviceId, vocabId);
  const enrolled = await enrollVocabularyForReview(progressRepo, deviceId, vocabId);
  await recordStudyActivity(dashboardRepo, deviceId, xpGain);

  if (!enrolled.ok) {
    return { ok: false, error: enrolled.error };
  }
  return {
    ok: true,
    value: { enrolled: true, addedToList: added.ok },
  };
}

export type ContextQuizDeps = {
  progressRepo: LearningProgressRepository;
  dashboardRepo: DashboardRepository;
  deviceId: string;
  vocabId: string;
  correct: boolean;
};

/** Kết quả FN-06 → rating SRS + XP. */
export async function recordContextQuizResult(deps: ContextQuizDeps): Promise<Result<void>> {
  const rating: ReviewRating = deps.correct ? 'good' : 'again';
  const xp = deps.correct ? 10 : 2;
  const review = await submitReview(deps.progressRepo, deps.deviceId, deps.vocabId, rating);
  if (!review.ok) return { ok: false, error: review.error };
  await recordStudyActivity(deps.dashboardRepo, deps.deviceId, xp);
  return { ok: true, value: undefined };
}

/** Thứ tự màn hình gợi ý trên mobile. */
export const LEARNING_FLOW_STEPS = [
  { order: 1, screen: 'fn01_vocabulary' as const, label: 'Bài học từ', req: 'REQ-01' },
  { order: 2, screen: 'fn06_context_review' as const, label: 'Context Review', req: 'REQ-06' },
  { order: 3, screen: 'fn05_spaced_repetition' as const, label: 'Ôn SRS', req: 'REQ-05' },
  { order: 4, screen: 'fn10_dashboard' as const, label: 'Tiến độ', req: 'REQ-10' },
] as const;
