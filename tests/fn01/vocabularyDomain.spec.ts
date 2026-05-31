import { describe, expect, it } from 'vitest';
import {
  assertVocabularyHasContext,
  highlightWordInLine,
  isValidVocabulary,
  isValidVocabularyWithDialogue,
} from '../../src/fn01_hoc_tu_vung_ngu_canh/domain/vocabulary';
import { DAILY_VOCABULARY_SEED } from '../../src/fn01_hoc_tu_vung_ngu_canh/data/dailyVocabularySeed';

const base = DAILY_VOCABULARY_SEED[0]!;

describe('FN-01 vocabulary domain', () => {
  it('validates seed vocabulary has context', () => {
    expect(isValidVocabulary(base)).toBe(true);
    expect(isValidVocabularyWithDialogue(base, true)).toBe(true);
  });

  it('rejects vocabulary without context', () => {
    const bad = { ...base, context: '' };
    expect(isValidVocabulary(bad)).toBe(false);
    expect(() => assertVocabularyHasContext(bad)).toThrow(/thiếu context/);
  });

  it('strict dialogue requires 2–5 lines', () => {
    const oneLine = {
      ...base,
      dialogue: { lines: [{ speaker: 'A', text: `We ${base.word} now.` }] },
    };
    expect(isValidVocabularyWithDialogue(oneLine, true)).toBe(false);
  });

  it('highlights target word in line', () => {
    const h = highlightWordInLine('We will deploy tonight.', 'deploy');
    expect(h).toEqual({ start: 8, end: 14 });
  });
});
