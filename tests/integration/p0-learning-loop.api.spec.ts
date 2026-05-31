import { describe, expect, it } from 'vitest';
import { getVocabularyLesson } from '../../src/fn01_hoc_tu_vung_ngu_canh/application/getVocabularyLesson';
import { createSupabaseVocabularyRepository } from '../../src/fn01_hoc_tu_vung_ngu_canh/infrastructure/vocabularyRepository';
import {
  buildContextReviewQuizFromLesson,
  gradeContextReviewAnswer,
} from '../../src/fn06_context_review/application/contextReviewUseCases';
import { getDueReviews, submitReview } from '../../src/fn05_spaced_repetition/application/spacedRepetitionUseCases';
import { createSupabaseLearningProgressRepository } from '../../src/fn05_spaced_repetition/infrastructure/learningProgressRepository';
import { getDashboardStats } from '../../src/fn10_dashboard_hoc_tap/application/dashboardUseCases';
import { createSupabaseDashboardRepository } from '../../src/fn10_dashboard_hoc_tap/infrastructure/dashboardRepository';
import {
  completeVocabularyStudyStep,
  recordContextQuizResult,
} from '../../src/shared/learningFlow';
import { createSupabaseUserVocabularyRepository } from '../../src/fn02_quan_ly_tu_vung_ca_nhan/infrastructure/userVocabularyRepository';
import { expectOk } from './helpers/assertResult';
import { getIntegrationContext } from './setup/testClient';
import { getTestEnv } from './setup/env';

const env = getTestEnv();
const describeApi = env.configured ? describe : describe.skip;

describeApi('P0 learning loop API (Supabase)', () => {
  it('lesson → study step → quiz → SRS → dashboard', async () => {
    const ctx = await getIntegrationContext();
    const vocabRepo = createSupabaseVocabularyRepository(ctx.asRepo);
    const userVocabRepo = createSupabaseUserVocabularyRepository(ctx.asRepo);
    const progressRepo = createSupabaseLearningProgressRepository(ctx.asRepo);
    const dashboardRepo = createSupabaseDashboardRepository(ctx.asRepo);

    const lesson = await getVocabularyLesson(vocabRepo, 1, 3);
    expectOk(lesson);
    const vocabId = lesson.value[0]!.id;

    const step = await completeVocabularyStudyStep({
      userVocabRepo,
      progressRepo,
      dashboardRepo,
      deviceId: ctx.deviceId,
      vocabId,
      xpGain: 5,
    });
    expectOk(step);

    const quiz = buildContextReviewQuizFromLesson(lesson.value, 1);
    expectOk(quiz);
    const q = quiz.value[0]!;
    const graded = gradeContextReviewAnswer(q, q.correctIndex);
    expectOk(graded);

    await recordContextQuizResult({
      progressRepo,
      dashboardRepo,
      deviceId: ctx.deviceId,
      vocabId,
      correct: graded.value.correct,
    });

    const due = await getDueReviews(progressRepo, ctx.deviceId);
    expectOk(due);

    const reviewed = await submitReview(progressRepo, ctx.deviceId, vocabId, 'good');
    expectOk(reviewed);

    const stats = await getDashboardStats(dashboardRepo, ctx.deviceId);
    expectOk(stats);
    expect(stats.value.xp).toBeGreaterThan(0);
  });
});
