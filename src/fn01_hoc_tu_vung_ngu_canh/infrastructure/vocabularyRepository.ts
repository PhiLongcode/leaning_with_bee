import { isMissingColumnError, isMissingTableError } from '../../shared/supabaseErrors';
import { fromTable, type SupabaseLikeClient } from '../../shared/supabaseClient';
import type { Vocabulary } from '../domain/vocabulary';
import { isValidVocabulary } from '../domain/vocabulary';
import { DAILY_VOCABULARY_SEED } from '../data/dailyVocabularySeed';
import { LEARNING_DAYS, type LearningDayMeta } from '../data/learningDaysMeta';
import { err, ok, type Result } from '../../shared/result';

export type VocabularyRepository = {
  listLessonDays(): Promise<Result<LearningDayMeta[]>>;
  listLessonItems(lessonDay: number, limit?: number): Promise<Result<Vocabulary[]>>;
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
  lesson_day?: number | null;
  lesson_order?: number | null;
  dialogue?: Vocabulary['dialogue'];
  explanation_native?: Vocabulary['explanationNative'];
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
    dialogue: row.dialogue ?? null,
    explanationNative: row.explanation_native ?? null,
    lessonDay: row.lesson_day ?? undefined,
    lessonOrder: row.lesson_order ?? undefined,
  };
}

function sortByLessonOrder(items: Vocabulary[]): Vocabulary[] {
  return [...items].sort((a, b) => (a.lessonOrder ?? 0) - (b.lessonOrder ?? 0));
}

const VOCAB_BASE_SELECT =
  'id, word, meaning, pronunciation, part_of_speech, context, example, topic, difficulty_level, dialogue, explanation_native';

async function listBySeedWords(
  client: SupabaseLikeClient,
  lessonDay: number,
  limit: number,
): Promise<Result<Vocabulary[]>> {
  const seeds = DAILY_VOCABULARY_SEED.filter((v) => v.lessonDay === lessonDay && isValidVocabulary(v)).slice(
    0,
    limit,
  );
  if (!seeds.length) return ok([]);

  const words = seeds.map((s) => s.word);
  const { data, error } = await fromTable(client, 'vocabulary')
    .select(VOCAB_BASE_SELECT)
    .in('word', words)
    .limit(words.length);

  if (error) return err(error.message ?? 'Không tải được từ vựng.');

  const byWord = new Map(
    ((data ?? []) as VocabularyRow[]).map((row) => [row.word, mapRow(row)]),
  );
  const merged = seeds.map((seed) => {
    const fromDb = byWord.get(seed.word);
    if (!fromDb) return seed;
    return {
      ...fromDb,
      lessonDay: seed.lessonDay,
      lessonOrder: seed.lessonOrder,
    };
  });
  return ok(sortByLessonOrder(merged.filter(isValidVocabulary)));
}

export function createMockVocabularyRepository(): VocabularyRepository {
  return {
    async listLessonDays() {
      return ok(LEARNING_DAYS);
    },
    async listLessonItems(lessonDay, limit = 10) {
      const items = DAILY_VOCABULARY_SEED.filter(
        (v) => v.lessonDay === lessonDay && isValidVocabulary(v),
      ).slice(0, limit);
      return ok(sortByLessonOrder(items));
    },
  };
}

export function createSupabaseVocabularyRepository(client: SupabaseLikeClient): VocabularyRepository {
  const mock = createMockVocabularyRepository();
  return {
    async listLessonDays() {
      const { data, error } = await fromTable(client, 'learning_days')
        .select('day_number, title, subtitle, topic, word_count')
        .order('day_number', { ascending: true })
        .limit(7);
      if (error && (isMissingTableError(error) || isMissingColumnError(error))) {
        return mock.listLessonDays();
      }
      if (error) return mock.listLessonDays();
      const rows = (data ?? []) as Record<string, unknown>[];
      if (!rows.length) return mock.listLessonDays();
      return ok(
        rows.map((r) => ({
          dayNumber: Number(r.day_number),
          title: String(r.title),
          subtitle: String(r.subtitle),
          topic: String(r.topic),
          wordCount: Number(r.word_count ?? 10),
        })),
      );
    },
    async listLessonItems(lessonDay, limit = 10) {
      const { data, error } = await fromTable(client, 'vocabulary')
        .select(
          'id, word, meaning, pronunciation, part_of_speech, context, example, topic, difficulty_level, lesson_day, lesson_order, dialogue, explanation_native',
        )
        .eq('lesson_day', lessonDay)
        .order('lesson_order', { ascending: true })
        .limit(limit);

      if (error) {
        if (isMissingColumnError(error)) {
          const byWord = await listBySeedWords(client, lessonDay, limit);
          if (byWord.ok && byWord.value.length > 0) return byWord;
        }
        return mock.listLessonItems(lessonDay, limit);
      }

      const rows = (data ?? []) as VocabularyRow[];
      const items = sortByLessonOrder(rows.map(mapRow).filter(isValidVocabulary));

      if (items.length === 0) {
        const byWord = await listBySeedWords(client, lessonDay, limit);
        if (byWord.ok && byWord.value.length > 0) return byWord;
        return mock.listLessonItems(lessonDay, limit);
      }

      return ok(items);
    },
  };
}
