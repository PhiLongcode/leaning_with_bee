import { describe, expect, it } from 'vitest';
import {
  buildContextReviewQuizFromLesson,
  gradeContextReviewAnswer,
} from '../../src/fn06_context_review/application/contextReviewUseCases';
import type { Vocabulary } from '../../src/fn01_hoc_tu_vung_ngu_canh/domain/vocabulary';

const sample: Vocabulary = {
  id: 'v1',
  word: 'deploy',
  meaning: 'triển khai',
  pronunciation: '/dɪˈplɔɪ/',
  partOfSpeech: 'verb',
  context: 'We will deploy the hotfix.',
  example: 'Deploy to staging first.',
  topic: 'Release',
  difficultyLevel: 2,
  dialogue: { lines: [{ speaker: 'PM', text: 'deploy now' }] },
  explanationNative: null,
};

describe('FN-06 Context Review', () => {
  it('builds quiz from lesson words', () => {
    const r = buildContextReviewQuizFromLesson([sample], 1);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toHaveLength(1);
      expect(r.value[0]!.choices).toContain('triển khai');
    }
  });

  it('grades correct answer', () => {
    const q = buildContextReviewQuizFromLesson([sample], 1);
    if (!q.ok) throw new Error('quiz failed');
    const correct = q.value[0]!.correctIndex;
    const g = gradeContextReviewAnswer(q.value[0]!, correct);
    expect(g.ok && g.value.correct).toBe(true);
  });

  it('grades wrong answer', () => {
    const q = buildContextReviewQuizFromLesson([sample], 1);
    if (!q.ok) throw new Error('quiz failed');
    const wrong = q.value[0]!.correctIndex === 0 ? 1 : 0;
    const g = gradeContextReviewAnswer(q.value[0]!, wrong);
    expect(g.ok && g.value.correct).toBe(false);
  });

  it('falls back to seed when lesson words empty', () => {
    const r = buildContextReviewQuizFromLesson([], 3);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.length).toBe(3);
  });
});
