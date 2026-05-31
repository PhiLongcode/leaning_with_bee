import { describe, expect, it } from 'vitest';
import {
  getVocabularyLesson,
  listLearningDays,
} from '../../src/fn01_hoc_tu_vung_ngu_canh/application/getVocabularyLesson';
import { createMockVocabularyRepository } from '../../src/fn01_hoc_tu_vung_ngu_canh/infrastructure/vocabularyRepository';

describe('FN-01 getVocabularyLesson', () => {
  const repo = createMockVocabularyRepository();

  it('lists 7 learning days', async () => {
    const r = await listLearningDays(repo);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.length).toBe(7);
  });

  it('returns lesson items for day 1', async () => {
    const r = await getVocabularyLesson(repo, 1, 10);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.length).toBeGreaterThan(0);
      expect(r.value[0]!.dialogue?.lines.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('rejects invalid lesson day', async () => {
    const r = await getVocabularyLesson(repo, 0);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/1 đến 7/);
  });
});
