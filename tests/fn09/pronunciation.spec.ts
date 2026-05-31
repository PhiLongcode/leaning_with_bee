import { describe, expect, it } from 'vitest';
import { scorePronunciation } from '../../src/fn09_pronunciation_scoring/application/pronunciationUseCases';
import { startSpeechSession } from '../../src/fn08_speech_to_text/application/speechUseCases';

describe('FN-09 pronunciation scoring', () => {
  it('scores high on exact transcript', () => {
    const prompt = 'We will deploy the hotfix.';
    const started = startSpeechSession('fn09-device', prompt);
    expect(started.ok).toBe(true);
    if (!started.ok) return;
    const scored = scorePronunciation(started.value.id, prompt, prompt);
    expect(scored.ok && scored.value.score).toBe(100);
  });

  it('scores lower on partial mismatch', () => {
    const prompt = 'We will deploy the hotfix.';
    const started = startSpeechSession('fn09-device-2', prompt);
    expect(started.ok).toBe(true);
    if (!started.ok) return;
    const scored = scorePronunciation(started.value.id, prompt, 'We deploy hotfix');
    expect(scored.ok && scored.value.score).toBeLessThan(100);
  });
});
