import { describe, expect, it } from 'vitest';
import { createSupabaseUserVocabularyRepository } from '../../src/fn02_quan_ly_tu_vung_ca_nhan/infrastructure/userVocabularyRepository';
import type { SupabaseLikeClient, SupabaseRow } from '../../src/shared/supabaseClient';

function fakeClient(tables: Record<string, SupabaseRow[]>): SupabaseLikeClient {
  return {
    from(table: string) {
      const rows = tables[table] ?? [];
      const filter: {
        eqCol?: string;
        eqVal?: unknown;
        inCol?: string;
        inVals?: unknown[];
        cols?: string;
      } = {};

      const run = (): SupabaseRow[] => {
        let out = [...rows];
        if (filter.eqCol) out = out.filter((r) => r[filter.eqCol!] === filter.eqVal);
        if (filter.inCol && filter.inVals) {
          const set = new Set(filter.inVals);
          out = out.filter((r) => set.has(r[filter.inCol!]));
        }
        return out;
      };

      const chain = {
        eq(column: string, value: unknown) {
          filter.eqCol = column;
          filter.eqVal = value;
          return chain;
        },
        in(column: string, values: unknown[]) {
          filter.inCol = column;
          filter.inVals = values;
          return chain;
        },
        select(columns?: string) {
          filter.cols = columns;
          return chain;
        },
        order() {
          return chain;
        },
        async limit() {
          return { data: run(), error: null };
        },
        async single() {
          const data = run()[0] ?? null;
          return { data, error: data ? null : { message: 'not found' } };
        },
        async maybeSingle() {
          const data = run()[0] ?? null;
          return { data, error: null };
        },
      };

      return {
        select(columns?: string) {
          filter.cols = columns;
          return chain;
        },
        insert() {
          return { select: () => chain };
        },
        update() {
          return chain;
        },
        delete() {
          return chain;
        },
        upsert() {
          return { select: () => chain };
        },
      };
    },
  };
}

describe('FN-02 Supabase user vocabulary repository', () => {
  it('list joins vocabulary word from vocabulary table by vocab_id UUID', async () => {
    const vocabId = '6ddf7e4a-6ba8-4edf-97bd-2966badfe515';
    const client = fakeClient({
      user_vocabulary: [
        {
          id: 'uv-1',
          device_id: 'dev-1',
          vocab_id: vocabId,
          is_favorite: false,
          is_difficult: false,
        },
      ],
      vocabulary: [
        {
          id: vocabId,
          word: 'deploy',
          meaning: 'triển khai',
          pronunciation: null,
          part_of_speech: 'verb',
          context: 'ctx',
          example: 'ex',
          topic: 'Release',
          difficulty_level: 2,
          dialogue: null,
          explanation_native: null,
        },
      ],
    });

    const repo = createSupabaseUserVocabularyRepository(client);
    const r = await repo.list('dev-1');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value[0]!.vocabulary?.word).toBe('deploy');
    expect(r.value[0]!.vocabulary?.meaning).toBe('triển khai');
  });
});
