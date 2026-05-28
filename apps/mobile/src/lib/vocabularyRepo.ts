import {
  createMockVocabularyRepository,
  createSupabaseVocabularyRepository,
  type SupabaseLikeClient,
  type VocabularyRepository,
} from '@hoc-cung-bee/features';
import { isSupabaseConfigured, supabase } from './supabase';

let cached: VocabularyRepository | null = null;

export function getVocabularyRepository(): VocabularyRepository {
  if (cached) return cached;
  cached = isSupabaseConfigured
    ? createSupabaseVocabularyRepository(supabase as unknown as SupabaseLikeClient)
    : createMockVocabularyRepository();
  return cached;
}
