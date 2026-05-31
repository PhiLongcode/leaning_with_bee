import {
  createMockCollectionRepository,
  createSupabaseCollectionRepository,
  type CollectionRepository,
  createMockConversationRepository,
  createSupabaseConversationRepository,
  type ConversationRepository,
  createMockDashboardRepository,
  createSupabaseDashboardRepository,
  type DashboardRepository,
  createMockLearningProgressRepository,
  createSupabaseLearningProgressRepository,
  type LearningProgressRepository,
  createMockNotificationRepository,
  createSupabaseNotificationRepository,
  type NotificationRepository,
  createMockBrandConfigRepository,
  createSupabaseBrandConfigRepository,
  type BrandConfigRepository,
  createMockSystemConfigRepository,
  createSupabaseSystemConfigRepository,
  type SystemConfigRepository,
  createMockSentenceRepository,
  createSupabaseSentenceRepository,
  type SentenceRepository,
  createMockUserVocabularyRepository,
  createSupabaseUserVocabularyRepository,
  type UserVocabularyRepository,
  createMockVocabEnrichRepository,
  createSupabaseVocabEnrichRepository,
  type VocabEnrichRepository,
  createMockVocabularyWriteRepository,
  createSupabaseVocabularyWriteRepository,
  type VocabularyWriteRepository,
  type SupabaseLikeClient,
} from '@hoc-cung-bee/features';
import { isSupabaseConfigured, supabase } from './supabase';

const client = () => supabase as unknown as SupabaseLikeClient;

function pick<T>(mock: T, supabaseFactory: (c: SupabaseLikeClient) => T): T {
  return isSupabaseConfigured ? supabaseFactory(client()) : mock;
}

let userVocab: UserVocabularyRepository | null = null;
let sentences: SentenceRepository | null = null;
let collections: CollectionRepository | null = null;
let progress: LearningProgressRepository | null = null;
let dashboard: DashboardRepository | null = null;
let notifications: NotificationRepository | null = null;
let brandConfig: BrandConfigRepository | null = null;
let systemConfig: SystemConfigRepository | null = null;
let vocabEnrich: VocabEnrichRepository | null = null;
let vocabularyWrite: VocabularyWriteRepository | null = null;

export function getUserVocabularyRepository(): UserVocabularyRepository {
  if (!userVocab) {
    userVocab = pick(
      createMockUserVocabularyRepository(),
      createSupabaseUserVocabularyRepository,
    );
  }
  return userVocab;
}

export function getSentenceRepository(): SentenceRepository {
  if (!sentences) {
    sentences = pick(createMockSentenceRepository(), createSupabaseSentenceRepository);
  }
  return sentences;
}

export function getCollectionRepository(): CollectionRepository {
  if (!collections) {
    collections = pick(createMockCollectionRepository(), createSupabaseCollectionRepository);
  }
  return collections;
}

export function getLearningProgressRepository(): LearningProgressRepository {
  if (!progress) {
    progress = pick(
      createMockLearningProgressRepository(),
      createSupabaseLearningProgressRepository,
    );
  }
  return progress;
}

export function getConversationRepository(deviceId: string): ConversationRepository {
  if (!isSupabaseConfigured) {
    return createMockConversationRepository();
  }
  return createSupabaseConversationRepository(client(), async (body) => {
    const { data, error } = await supabase.functions.invoke('ai-conversation', {
      body,
      headers: { 'X-Device-Id': deviceId },
    });
    return { data, error: error ?? null };
  });
}

export function getDashboardRepository(): DashboardRepository {
  if (!dashboard) {
    dashboard = pick(createMockDashboardRepository(), createSupabaseDashboardRepository);
  }
  return dashboard;
}

export function getNotificationRepository(): NotificationRepository {
  if (!notifications) {
    notifications = pick(
      createMockNotificationRepository(),
      createSupabaseNotificationRepository,
    );
  }
  return notifications;
}

export function getBrandConfigRepository(): BrandConfigRepository {
  if (!brandConfig) {
    brandConfig = pick(
      createMockBrandConfigRepository(),
      createSupabaseBrandConfigRepository,
    );
  }
  return brandConfig;
}

export function getSystemConfigRepository(): SystemConfigRepository {
  if (!systemConfig) {
    systemConfig = pick(
      createMockSystemConfigRepository(),
      createSupabaseSystemConfigRepository,
    );
  }
  return systemConfig;
}

export function getVocabEnrichRepository(deviceId: string): VocabEnrichRepository {
  if (!isSupabaseConfigured) {
    return createMockVocabEnrichRepository();
  }
  return createSupabaseVocabEnrichRepository(async (body) => {
    const { data, error } = await supabase.functions.invoke('vocab-enrich', {
      body,
      headers: { 'X-Device-Id': deviceId },
    });
    return { data, error: error ?? null };
  });
}

export function getVocabularyWriteRepository(): VocabularyWriteRepository {
  if (!vocabularyWrite) {
    vocabularyWrite = pick(
      createMockVocabularyWriteRepository(),
      createSupabaseVocabularyWriteRepository,
    );
  }
  return vocabularyWrite;
}
