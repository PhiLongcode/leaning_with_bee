import { describe, expect, it } from 'vitest';
import { getVocabularyLesson, listLearningDays } from '../../src/fn01_hoc_tu_vung_ngu_canh/application/getVocabularyLesson';
import { createSupabaseVocabularyRepository } from '../../src/fn01_hoc_tu_vung_ngu_canh/infrastructure/vocabularyRepository';
import { expectOk } from './helpers/assertResult';
import { getIntegrationContext } from './setup/testClient';
import { getTestEnv } from './setup/env';

const env = getTestEnv();
const describeApi = env.configured ? describe : describe.skip;

describeApi('FN-01 vocabulary API (Supabase)', () => {
  it('lists learning days from database or seed fallback', async () => {
    const ctx = await getIntegrationContext();
    const repo = createSupabaseVocabularyRepository(ctx.asRepo);
    const r = await listLearningDays(repo);
    expectOk(r);
    expect(r.value.length).toBeGreaterThan(0);
  });

  it('loads lesson day 1 with dialogue', async () => {
    const ctx = await getIntegrationContext();
    const repo = createSupabaseVocabularyRepository(ctx.asRepo);
    const r = await getVocabularyLesson(repo, 1, 10);
    expectOk(r);
    expect(r.value.length).toBeGreaterThan(0);
    expect(r.value[0]!.word).toBeTruthy();
    const lines = r.value[0]!.dialogue?.lines;
    if (lines?.length) {
      expect(lines.length).toBeGreaterThanOrEqual(2);
    }
  });
});
