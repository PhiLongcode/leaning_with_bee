import type { SupabaseLikeClient } from '../../shared/supabaseClient';
import type { Vocabulary } from '../domain/vocabulary';
import { isValidVocabulary } from '../domain/vocabulary';
import { MOCK_VOCABULARIES } from '../data/mockVocabularies';
import { err, ok, type Result } from '../../shared/result';

export type VocabularyRepository = {
  listLessonItems(limit?: number): Promise<Result<Vocabulary[]>>;
};

type VocabularyRow = {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string | null;
  part_of_speech: string | null;
  context: string;
  example: string;
  topic: string;
  difficulty_level: number;
};

function mapRow(row: VocabularyRow): Vocabulary {
  return {
    id: row.id,
    word: row.word,
    meaning: row.meaning,
    pronunciation: row.pronunciation,
    partOfSpeech: row.part_of_speech,
    context: row.context,
    example: row.example,
    topic: row.topic,
    difficultyLevel: row.difficulty_level,
  };
}

export function createMockVocabularyRepository(): VocabularyRepository {
  return {
    async listLessonItems(limit = 10) {
      const items = MOCK_VOCABULARIES.filter(isValidVocabulary).slice(0, limit);
      return ok(items);
    },
  };
}

export function createSupabaseVocabularyRepository(client: SupabaseLikeClient): VocabularyRepository {
  return {
    async listLessonItems(limit = 10) {
      const { data, error } = await client
        .from('vocabulary')
        .select(
          'id, word, meaning, pronunciation, part_of_speech, context, example, topic, difficulty_level',
        )
        .limit(limit);

      if (error) return err(error.message);

      const rows = (data ?? []) as VocabularyRow[];
      const items = rows.map(mapRow).filter(isValidVocabulary);

      if (items.length === 0) {
        return createMockVocabularyRepository().listLessonItems(limit);
      }

      return ok(items);
    },
  };
}
