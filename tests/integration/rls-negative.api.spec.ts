import { describe, expect, it } from 'vitest';
import { listMyVocabulary } from '../../src/fn02_quan_ly_tu_vung_ca_nhan/application/userVocabularyUseCases';
import { createSupabaseUserVocabularyRepository } from '../../src/fn02_quan_ly_tu_vung_ca_nhan/infrastructure/userVocabularyRepository';
import { getVocabularyLesson } from '../../src/fn01_hoc_tu_vung_ngu_canh/application/getVocabularyLesson';
import { createSupabaseVocabularyRepository } from '../../src/fn01_hoc_tu_vung_ngu_canh/infrastructure/vocabularyRepository';
import { expectOk } from './helpers/assertResult';
import { getIntegrationContext } from './setup/testClient';
import { getTestEnv } from './setup/env';

const env = getTestEnv();
const describeApi = env.configured ? describe : describe.skip;

describeApi('RLS / device isolation (Supabase)', () => {
  it('FN02 wrong device_id does not see another device list', async () => {
    const ctx = await getIntegrationContext();
    const repo = createSupabaseUserVocabularyRepository(ctx.asRepo);

    const own = await listMyVocabulary(repo, ctx.deviceId);
    expectOk(own);

    const alien = await listMyVocabulary(repo, `wrong-device-${ctx.deviceId}`);
    expectOk(alien);
    expect(alien.value.length).toBe(0);
  });

  it('FN01 vocabulary read remains public/seed for any caller', async () => {
    const ctx = await getIntegrationContext();
    const repo = createSupabaseVocabularyRepository(ctx.asRepo);
    const lesson = await getVocabularyLesson(repo, 1, 3);
    expectOk(lesson);
    expect(lesson.value.length).toBeGreaterThan(0);
  });
});
