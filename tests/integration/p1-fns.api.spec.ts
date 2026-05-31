import { beforeAll, describe, expect, it } from 'vitest';
import { listMyVocabulary } from '../../src/fn02_quan_ly_tu_vung_ca_nhan/application/userVocabularyUseCases';
import { createSupabaseUserVocabularyRepository } from '../../src/fn02_quan_ly_tu_vung_ca_nhan/infrastructure/userVocabularyRepository';
import { listSentences } from '../../src/fn03_quan_ly_cau_giao_tiep/application/sentenceUseCases';
import { createSupabaseSentenceRepository } from '../../src/fn03_quan_ly_cau_giao_tiep/infrastructure/sentenceRepository';
import { listCollections } from '../../src/fn04_learning_collection/application/collectionUseCases';
import { createSupabaseCollectionRepository } from '../../src/fn04_learning_collection/infrastructure/collectionRepository';
import { listConversationScenarios } from '../../src/fn07_ai_conversation/application/conversationUseCases';
import { createSupabaseConversationRepository } from '../../src/fn07_ai_conversation/infrastructure/conversationRepository';
import { getNotificationSettings } from '../../src/fn11_notification_reminder/application/notificationUseCases';
import { createSupabaseNotificationRepository } from '../../src/fn11_notification_reminder/infrastructure/notificationRepository';
import { getAppBrandConfig } from '../../src/fn15_brand_config/application/brandConfigUseCases';
import { getAppSystemConfig } from '../../src/fn15_brand_config/application/systemConfigUseCases';
import { createSupabaseBrandConfigRepository } from '../../src/fn15_brand_config/infrastructure/brandConfigRepository';
import { createSupabaseSystemConfigRepository } from '../../src/fn15_brand_config/infrastructure/systemConfigRepository';
import { expectOk } from './helpers/assertResult';
import { getIntegrationContext, type IntegrationContext } from './setup/testClient';
import { getTestEnv } from './setup/env';

const env = getTestEnv();
const describeApi = env.configured ? describe : describe.skip;

describeApi('P1 FN APIs (Supabase)', () => {
  let ctx: IntegrationContext;

  beforeAll(async () => {
    ctx = await getIntegrationContext();
  });

  it('FN02 listMyVocabulary returns array for device', async () => {
    const repo = createSupabaseUserVocabularyRepository(ctx.asRepo);
    const r = await listMyVocabulary(repo, ctx.deviceId);
    expectOk(r);
    expect(Array.isArray(r.value)).toBe(true);
  });

  it('FN03 listSentences returns array', async () => {
    const repo = createSupabaseSentenceRepository(ctx.asRepo);
    const r = await listSentences(repo, ctx.deviceId);
    expectOk(r);
    expect(Array.isArray(r.value)).toBe(true);
  });

  it('FN04 listCollections returns array', async () => {
    const repo = createSupabaseCollectionRepository(ctx.asRepo);
    const r = await listCollections(repo, ctx.deviceId);
    expectOk(r);
    expect(Array.isArray(r.value)).toBe(true);
  });

  it('FN07 listConversationScenarios returns scenarios', async () => {
    const repo = createSupabaseConversationRepository(ctx.asRepo);
    const r = await listConversationScenarios(repo);
    expectOk(r);
    expect(r.value.length).toBeGreaterThan(0);
  });

  it('FN11 getNotificationSettings returns defaults or row', async () => {
    const repo = createSupabaseNotificationRepository(ctx.asRepo);
    const r = await getNotificationSettings(repo, ctx.deviceId);
    expectOk(r);
    expect(r.value.deviceId).toBe(ctx.deviceId);
    expect(r.value.reminderHour).toBeGreaterThanOrEqual(0);
  });

  it('FN15 brand + system config readable', async () => {
    const brandRepo = createSupabaseBrandConfigRepository(ctx.asRepo);
    const systemRepo = createSupabaseSystemConfigRepository(ctx.asRepo);
    const brand = await getAppBrandConfig(brandRepo, env.supabaseUrl);
    expectOk(brand);
    expect(brand.value.brandName).toBeTruthy();
    const system = await getAppSystemConfig(systemRepo);
    expectOk(system);
    expect(system.value.permissions).toBeDefined();
  });
});
