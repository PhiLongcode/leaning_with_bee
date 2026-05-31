import { describe, expect, it } from 'vitest';
import { enrichVocabulary } from '../../src/fn17_vocab_ai_enrich/application/vocabEnrichUseCases';
import { createMockVocabEnrichRepository } from '../../src/fn17_vocab_ai_enrich/infrastructure/vocabEnrichRepository';

describe('FN-17 enrich use cases', () => {
  const repo = createMockVocabEnrichRepository();

  it('rejects invalid request before calling repo', async () => {
    const r = await enrichVocabulary(repo, { word: '', mode: 'full', nativeLanguage: 'vi' });
    expect(r.ok).toBe(false);
  });

  it('returns enrich result from mock repo', async () => {
    const r = await enrichVocabulary(repo, {
      word: 'deploy',
      mode: 'full',
      topic: 'Release',
      nativeLanguage: 'vi',
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.word).toBe('deploy');
      expect(r.value.dialogue?.lines.length).toBeGreaterThanOrEqual(2);
    }
  });
});
