import { describe, expect, it } from 'vitest';
import {
  createSentence,
  deleteSentence,
  updateSentence,
} from '../../src/fn03_quan_ly_cau_giao_tiep/application/sentenceUseCases';
import { createMockSentenceRepository } from '../../src/fn03_quan_ly_cau_giao_tiep/infrastructure/sentenceRepository';

describe('FN-03 Sentences', () => {
  const repo = createMockSentenceRepository();
  const deviceId = 'dev-test';

  it('rejects empty create', async () => {
    const r = await createSentence(repo, deviceId, {
      sentence: '  ',
      translation: 'x',
      context: null,
      topic: 'Standup',
    });
    expect(r.ok).toBe(false);
  });

  it('creates and updates sentence', async () => {
    const created = await createSentence(repo, deviceId, {
      sentence: 'We are on track.',
      translation: 'Chúng ta đúng tiến độ.',
      context: 'Standup',
      topic: 'Standup',
    });
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const updated = await updateSentence(repo, created.value.id, {
      translation: 'Đúng tiến độ.',
    });
    expect(updated.ok).toBe(true);
    await deleteSentence(repo, created.value.id);
  });
});
