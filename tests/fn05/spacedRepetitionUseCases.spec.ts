import { describe, expect, it } from 'vitest';
import {
  enrollVocabularyForReview,
  getDueReviews,
  submitReview,
} from '../../src/fn05_spaced_repetition/application/spacedRepetitionUseCases';
import { createMockLearningProgressRepository } from '../../src/fn05_spaced_repetition/infrastructure/learningProgressRepository';

describe('FN-05 spaced repetition use cases', () => {
  const repo = createMockLearningProgressRepository();
  const deviceId = `fn05-test-${Date.now()}`;

  it('returns due reviews', async () => {
    const r = await getDueReviews(repo, deviceId);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.length).toBeGreaterThan(0);
  });

  it('enrolls vocabulary for review', async () => {
    const r = await enrollVocabularyForReview(repo, deviceId, 'day1-1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.vocabId).toBe('day1-1');
  });

  it('submitReview updates repetition level on good', async () => {
    await enrollVocabularyForReview(repo, deviceId, 'day1-2');
    const r = await submitReview(repo, deviceId, 'day1-2', 'good');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.repetitionLevel).toBeGreaterThanOrEqual(1);
  });
});
