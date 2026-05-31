import { beforeAll, describe, expect, it } from 'vitest';
import { enrichVocabulary } from '../../src/fn17_vocab_ai_enrich/application/vocabEnrichUseCases';
import { createSupabaseVocabEnrichRepository } from '../../src/fn17_vocab_ai_enrich/infrastructure/vocabEnrichRepository';
import { getAppSystemConfig } from '../../src/fn15_brand_config/application/systemConfigUseCases';
import { createSupabaseSystemConfigRepository } from '../../src/fn15_brand_config/infrastructure/systemConfigRepository';
import { expectOk } from './helpers/assertResult';
import { getIntegrationContext, type IntegrationContext } from './setup/testClient';
import { getTestEnv } from './setup/env';

const env = getTestEnv();
const describeApi = env.configured ? describe : describe.skip;

describeApi('FN17 vocab-enrich API (Supabase Edge)', () => {
  let ctx: IntegrationContext;

  beforeAll(async () => {
    ctx = await getIntegrationContext();
  });

  it('FN17 enrichVocabulary via vocab-enrich Edge or mock fallback', async () => {
    const systemRepo = createSupabaseSystemConfigRepository(ctx.asRepo);
    const system = await getAppSystemConfig(systemRepo);
    expectOk(system);

    const repo = createSupabaseVocabEnrichRepository(async (body) => {
      const { data, error } = await ctx.client.functions.invoke('vocab-enrich', {
        body,
        headers: { 'X-Device-Id': ctx.deviceId },
      });
      return { data, error: error as Error | null };
    });

    const r = await enrichVocabulary(repo, {
      word: 'deploy',
      mode: 'full',
      topic: 'Release',
      nativeLanguage: 'vi',
    });
    expectOk(r);
    expect(r.value.word).toBe('deploy');
    expect(r.value.dialogue?.lines.length).toBeGreaterThanOrEqual(2);
    expect(r.value.explanationNative?.language).toBe('vi');
  });
});
