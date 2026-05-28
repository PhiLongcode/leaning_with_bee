import { DAILY_VOCABULARY_SEED } from '../../fn01_hoc_tu_vung_ngu_canh/data/dailyVocabularySeed';
import type { Vocabulary } from '../../fn01_hoc_tu_vung_ngu_canh/domain/vocabulary';
import { err, ok, type Result } from '../../shared/result';
import { isInvalidUuid, isMissingTableError } from '../../shared/supabaseErrors';
import { fromTable, type SupabaseLikeClient } from '../../shared/supabaseClient';
import type { UserVocabulary } from '../domain/userVocabulary';

export type UserVocabularyRepository = {
  list(deviceId: string): Promise<Result<UserVocabulary[]>>;
  add(deviceId: string, vocabId: string): Promise<Result<UserVocabulary>>;
  setFavorite(id: string, value: boolean): Promise<Result<UserVocabulary>>;
  setDifficult(id: string, value: boolean): Promise<Result<UserVocabulary>>;
  remove(id: string): Promise<Result<void>>;
};

const mockStore = new Map<string, UserVocabulary>();

function vocabById(id: string): Vocabulary | undefined {
  return DAILY_VOCABULARY_SEED.find((v) => v.id === id);
}

function mapRow(row: Record<string, unknown>, vocabulary?: Vocabulary): UserVocabulary {
  return {
    id: String(row.id),
    deviceId: String(row.device_id ?? row.deviceId),
    vocabId: String(row.vocab_id ?? row.vocabId),
    isFavorite: Boolean(row.is_favorite ?? row.isFavorite),
    isDifficult: Boolean(row.is_difficult ?? row.isDifficult),
    vocabulary,
  };
}

export function createMockUserVocabularyRepository(): UserVocabularyRepository {
  return {
    async list(deviceId) {
      const items = [...mockStore.values()].filter((u) => u.deviceId === deviceId);
      return ok(items);
    },
    async add(deviceId, vocabId) {
      const existing = [...mockStore.values()].find(
        (u) => u.deviceId === deviceId && u.vocabId === vocabId,
      );
      if (existing) return ok(existing);
      const entry: UserVocabulary = {
        id: `uv-${Date.now()}`,
        deviceId,
        vocabId,
        isFavorite: false,
        isDifficult: false,
        vocabulary: vocabById(vocabId),
      };
      mockStore.set(entry.id, entry);
      return ok(entry);
    },
    async setFavorite(id, value) {
      const row = mockStore.get(id);
      if (!row) return err('Không tìm thấy từ trong sổ.');
      const next = { ...row, isFavorite: value };
      mockStore.set(id, next);
      return ok(next);
    },
    async setDifficult(id, value) {
      const row = mockStore.get(id);
      if (!row) return err('Không tìm thấy từ trong sổ.');
      const next = { ...row, isDifficult: value };
      mockStore.set(id, next);
      return ok(next);
    },
    async remove(id) {
      mockStore.delete(id);
      return ok(undefined);
    },
  };
}

export function createSupabaseUserVocabularyRepository(
  client: SupabaseLikeClient,
): UserVocabularyRepository {
  const mock = createMockUserVocabularyRepository();
  return {
    async list(deviceId) {
      const { data, error } = await fromTable(client, 'user_vocabulary')
        .select('id, device_id, vocab_id, is_favorite, is_difficult')
        .eq('device_id', deviceId)
        .limit(200);
      if (error) return mock.list(deviceId);
      const rows = (data ?? []) as Record<string, unknown>[];
      if (!rows.length) return mock.list(deviceId);
      return ok(rows.map((r) => mapRow(r, vocabById(String(r.vocab_id)))));
    },
    async add(deviceId, vocabId) {
      let resolvedId = vocabId;
      if (isInvalidUuid(vocabId)) {
        const seed = DAILY_VOCABULARY_SEED.find((v) => v.id === vocabId);
        if (seed) {
          const lookup = await fromTable(client, 'vocabulary')
            .select('id')
            .eq('word', seed.word)
            .maybeSingle();
          if (lookup.error || !lookup.data) return mock.add(deviceId, vocabId);
          resolvedId = String((lookup.data as Record<string, unknown>).id);
        } else {
          return mock.add(deviceId, vocabId);
        }
      }
      const { data, error } = await fromTable(client, 'user_vocabulary')
        .insert({ device_id: deviceId, vocab_id: resolvedId })
        .select('id, device_id, vocab_id, is_favorite, is_difficult')
        .single();
      if (error) return mock.add(deviceId, vocabId);
      return ok(mapRow(data!, vocabById(resolvedId)));
    },
    async setFavorite(id, value) {
      if (isInvalidUuid(id)) return mock.setFavorite(id, value);
      const { data, error } = await fromTable(client, 'user_vocabulary')
        .update({ is_favorite: value })
        .eq('id', id)
        .select('id, device_id, vocab_id, is_favorite, is_difficult')
        .single();
      if (error) return mock.setFavorite(id, value);
      return ok(mapRow(data!, vocabById(String(data!.vocab_id))));
    },
    async setDifficult(id, value) {
      if (isInvalidUuid(id)) return mock.setDifficult(id, value);
      const { data, error } = await fromTable(client, 'user_vocabulary')
        .update({ is_difficult: value })
        .eq('id', id)
        .select('id, device_id, vocab_id, is_favorite, is_difficult')
        .single();
      if (error) return mock.setDifficult(id, value);
      return ok(mapRow(data!, vocabById(String(data!.vocab_id))));
    },
    async remove(id) {
      if (isInvalidUuid(id)) return mock.remove(id);
      const { error } = await fromTable(client, 'user_vocabulary').delete().eq('id', id).limit(1);
      if (error) return mock.remove(id);
      return ok(undefined);
    },
  };
}
