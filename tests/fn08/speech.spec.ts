import { describe, expect, it } from 'vitest';
import {
  startSpeechSession,
  submitSpeechTranscript,
} from '../../src/fn08_speech_to_text/application/speechUseCases';

describe('FN-08 speech to text', () => {
  it('matches transcript to prompt', () => {
    const prompt = 'We will deploy the hotfix.';
    const started = startSpeechSession('fn08-device', prompt);
    expect(started.ok).toBe(true);
    if (!started.ok) return;
    const stt = submitSpeechTranscript(started.value.id, prompt);
    expect(stt.ok && stt.value.matchScore).toBe(100);
  });
});
