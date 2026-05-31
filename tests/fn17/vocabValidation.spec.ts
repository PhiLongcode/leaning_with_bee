import { describe, expect, it } from 'vitest';
import {
  validateDialogue,
  validateEnrichRequest,
  validateExplanationNative,
} from '../../src/fn17_vocab_ai_enrich/domain/vocabValidation';

describe('FN-17 vocab validation', () => {
  it('rejects empty enrich word', () => {
    const r = validateEnrichRequest({ word: '  ', mode: 'full', nativeLanguage: 'vi' });
    expect(r.valid).toBe(false);
  });

  it('enrich mode requires partial fields', () => {
    const r = validateEnrichRequest({ word: 'deploy', mode: 'enrich', nativeLanguage: 'vi' });
    expect(r.valid).toBe(false);
    const ok = validateEnrichRequest({
      word: 'deploy',
      mode: 'enrich',
      meaning: 'triển khai',
      nativeLanguage: 'vi',
    });
    expect(ok.valid).toBe(true);
  });

  it('validates dialogue with two speakers and target word', () => {
    const r = validateDialogue('deploy', {
      lines: [
        { speaker: 'PM', text: 'When do we deploy?' },
        { speaker: 'DEV', text: 'We deploy after QA.' },
      ],
    });
    expect(r.valid).toBe(true);
  });

  it('validates explanation native fields', () => {
    const r = validateExplanationNative({
      language: 'vi',
      summary: 'Tóm tắt',
      usageInContext: 'Dùng khi release',
    });
    expect(r.valid).toBe(true);
  });
});
