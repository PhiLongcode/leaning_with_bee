import { err, ok, type Result } from '../../shared/result';
import { fromTable, type SupabaseLikeClient } from '../../shared/supabaseClient';
import type { Vocabulary } from '../../fn01_hoc_tu_vung_ngu_canh/domain/vocabulary';
import type { VocabEnrichResult } from '../domain/vocabEnrich';

export type VocabularyWriteRepository = {
  createVocabulary(payload: Omit<Vocabulary, 'id'>): Promise<Result<Vocabulary>>;
  linkToUser(deviceId: string, vocabId: string): Promise<Result<void>>;
};

function mapRow(row: Record<string, unknown>): Vocabulary {
  return {
    id: String(row.id),
    word: String(row.word),
    meaning: String(row.meaning),
    pronunciation: row.pronunciation != null ? String(row.pronunciation) : null,
    partOfSpeech: row.part_of_speech != null ? String(row.part_of_speech) : null,
    context: String(row.context),
    example: String(row.example),
    topic: String(row.topic),
    difficultyLevel: Number(row.difficulty_level ?? 2),
    dialogue: (row.dialogue as Vocabulary['dialogue']) ?? null,
    explanationNative: (row.explanation_native as Vocabulary['explanationNative']) ?? null,
  };
}

export function enrichToVocabularyPayload(result: VocabEnrichResult): Omit<Vocabulary, 'id'> {
  return {
    word: result.word,
    meaning: result.meaning,
    pronunciation: result.pronunciation,
    partOfSpeech: result.partOfSpeech,
    context: result.context,
    example: result.example,
    topic: result.topic,
    difficultyLevel: result.difficultyLevel,
    dialogue: result.dialogue,
    explanationNative: result.explanationNative,
  };
}

export function createMockVocabularyWriteRepository(): VocabularyWriteRepository {
  const store = new Map<string, Vocabulary>();
  let seq = 1;
  return {
    async createVocabulary(payload) {
      const id = `mock-vocab-${seq++}`;
      const row = { ...payload, id };
      store.set(id, row);
      return ok(row);
    },
    async linkToUser(_deviceId, _vocabId) {
      return ok(undefined);
    },
  };
}

export function createSupabaseVocabularyWriteRepository(
  client: SupabaseLikeClient,
): VocabularyWriteRepository {
  const mock = createMockVocabularyWriteRepository();
  return {
    async createVocabulary(payload) {
      const { data, error } = await fromTable(client, 'vocabulary')
        .insert({
          word: payload.word,
          meaning: payload.meaning,
          pronunciation: payload.pronunciation,
          part_of_speech: payload.partOfSpeech,
          context: payload.context,
          example: payload.example,
          topic: payload.topic,
          difficulty_level: payload.difficultyLevel,
          dialogue: payload.dialogue ?? null,
          explanation_native: payload.explanationNative ?? null,
        })
        .select(
          'id, word, meaning, pronunciation, part_of_speech, context, example, topic, difficulty_level, dialogue, explanation_native',
        )
        .single();
      if (error || !data) {
        return err(error?.message ?? 'Không tạo được từ vựng');
      }
      return ok(mapRow(data as Record<string, unknown>));
    },
    async linkToUser(deviceId, vocabId) {
      const { error } = await fromTable(client, 'user_vocabulary').insert({
        device_id: deviceId,
        vocab_id: vocabId,
      });
      if (error) return err(error.message ?? 'Không liên kết user_vocabulary');
      return ok(undefined);
    },
  };
}

export async function saveEnrichedVocabulary(
  repo: VocabularyWriteRepository,
  deviceId: string,
  enriched: VocabEnrichResult,
): Promise<Result<Vocabulary>> {
  const created = await repo.createVocabulary(enrichToVocabularyPayload(enriched));
  if (!created.ok) return created;
  const linked = await repo.linkToUser(deviceId, created.value.id);
  if (!linked.ok) return err(linked.error);
  return created;
}
