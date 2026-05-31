import { describe, expect, it } from 'vitest';
import {
  completeVocabularyStudyStep,
  recordContextQuizResult,
} from '../../src/shared/learningFlow';
import { createMockUserVocabularyRepository } from '../../src/fn02_quan_ly_tu_vung_ca_nhan/infrastructure/userVocabularyRepository';
import { createMockLearningProgressRepository } from '../../src/fn05_spaced_repetition/infrastructure/learningProgressRepository';
import { createMockDashboardRepository } from '../../src/fn10_dashboard_hoc_tap/infrastructure/dashboardRepository';

describe('shared learningFlow', () => {
  const deviceId = `flow-test-${Date.now()}`;
  const vocabId = 'day1-1';

  it('completeVocabularyStudyStep enrolls SRS and records XP', async () => {
    const userVocabRepo = createMockUserVocabularyRepository();
    const progressRepo = createMockLearningProgressRepository();
    const dashboardRepo = createMockDashboardRepository();

    const r = await completeVocabularyStudyStep({
      userVocabRepo,
      progressRepo,
      dashboardRepo,
      deviceId,
      vocabId,
      xpGain: 5,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;

    const stats = await dashboardRepo.getStats(deviceId);
    expect(stats.ok && stats.value.xp).toBeGreaterThanOrEqual(5);
  });

  it('recordContextQuizResult applies good rating on correct answer', async () => {
    const progressRepo = createMockLearningProgressRepository();
    const dashboardRepo = createMockDashboardRepository();
    await progressRepo.ensureEnrolled(deviceId, vocabId);

    const r = await recordContextQuizResult({
      progressRepo,
      dashboardRepo,
      deviceId,
      vocabId,
      correct: true,
    });
    expect(r.ok).toBe(true);
    const review = await progressRepo.submitReview(deviceId, vocabId, 'good');
    expect(review.ok).toBe(true);
  });
});
