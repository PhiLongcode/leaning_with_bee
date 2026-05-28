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
  createMockSentenceRepository,
  createSupabaseSentenceRepository,
  type SentenceRepository,
  createMockUserVocabularyRepository,
  createSupabaseUserVocabularyRepository,
  type UserVocabularyRepository,
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
let conversation: ConversationRepository | null = null;
let dashboard: DashboardRepository | null = null;
let notifications: NotificationRepository | null = null;

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

export function getConversationRepository(): ConversationRepository {
  if (!conversation) {
    conversation = pick(
      createMockConversationRepository(),
      createSupabaseConversationRepository,
    );
  }
  return conversation;
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
