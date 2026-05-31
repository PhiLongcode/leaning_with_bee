import { beforeAll, describe, expect, it } from 'vitest';
import { expectOk } from './helpers/assertResult';
import { getIntegrationContext, type IntegrationContext } from './setup/testClient';
import { getTestEnv } from './setup/env';
import {
  scorePronunciation,
} from '../../src/fn09_pronunciation_scoring/application/pronunciationUseCases';
import {
  startSpeechSession,
  submitSpeechTranscript,
} from '../../src/fn08_speech_to_text/application/speechUseCases';

const env = getTestEnv();
const describeApi = env.configured ? describe : describe.skip;

describeApi('FN08/09 speech API (Supabase Edge)', () => {
  let ctx: IntegrationContext;

  beforeAll(async () => {
    ctx = await getIntegrationContext();
  });

  it('FN08/09 speech-practice Edge returns score and persists when possible', async () => {
    const prompt = 'We will deploy the hotfix after QA signs off.';
    const transcript = 'We will deploy the hotfix after QA signs off.';
    const { data, error } = await ctx.client.functions.invoke('speech-practice', {
      body: { prompt, transcript },
      headers: { 'X-Device-Id': ctx.deviceId },
    });
    expect(error).toBeNull();
    expect(data).toBeTruthy();
    const payload = data as {
      matchScore?: number;
      score?: number;
      feedback?: string;
      persisted?: boolean;
    };
    expect(typeof payload.matchScore).toBe('number');
    expect(payload.matchScore).toBeGreaterThanOrEqual(80);
    expect(typeof payload.feedback).toBe('string');
    if (payload.persisted) {
      expect(payload.sessionId).toBeTruthy();
    }
  });

  it('FN08 domain session + transcript (in-process, smoke)', () => {
    const started = startSpeechSession(ctx.deviceId, 'deploy the release');
    expectOk(started);
    const submitted = submitSpeechTranscript(started.value.id, 'deploy the release');
    expectOk(submitted);
    expect(submitted.value.matchScore).toBeGreaterThanOrEqual(80);
  });

  it('FN09 scorePronunciation aligns with transcript match', () => {
    const expected = 'deploy the hotfix';
    const scored = scorePronunciation('api-smoke', expected, expected);
    expectOk(scored);
    expect(scored.value.score).toBeGreaterThanOrEqual(90);
  });
});
