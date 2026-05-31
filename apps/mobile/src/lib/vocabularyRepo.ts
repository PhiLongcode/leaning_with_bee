import {
  createMockVocabularyRepository,
  createSupabaseVocabularyRepository,
  type SupabaseLikeClient,
  type VocabularyRepository,
} from '@hoc-cung-bee/features';
import { isSupabaseConfigured, supabase } from './supabase';

let cached: VocabularyRepository | null = null;

function isE2eWebSession(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('e2e') === '1';
}

export function getVocabularyRepository(): VocabularyRepository {
  if (cached) return cached;
  cached =
    isSupabaseConfigured && !isE2eWebSession()
      ? createSupabaseVocabularyRepository(supabase as unknown as SupabaseLikeClient)
      : createMockVocabularyRepository();
  return cached;
}
