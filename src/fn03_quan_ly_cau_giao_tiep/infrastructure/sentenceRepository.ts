import { err, ok, type Result } from '../../shared/result';
import { fromTable, type SupabaseLikeClient } from '../../shared/supabaseClient';
import type { UserSentence } from '../domain/sentence';

export type SentenceRepository = {
  list(deviceId: string): Promise<Result<UserSentence[]>>;
  create(
    deviceId: string,
    input: Omit<UserSentence, 'id' | 'deviceId'>,
  ): Promise<Result<UserSentence>>;
  update(id: string, input: Partial<Omit<UserSentence, 'id' | 'deviceId'>>): Promise<Result<UserSentence>>;
  remove(id: string): Promise<Result<void>>;
};

const mockStore = new Map<string, UserSentence>();

const SEED: UserSentence[] = [
  {
    id: 'sent-1',
    deviceId: 'seed',
    sentence: 'I am blocked on the API credentials.',
    translation: 'Tôi đang bị chặn vì thiếu thông tin đăng nhập API.',
    context: 'Daily stand-up',
    topic: 'Standup',
  },
];

function mapRow(row: Record<string, unknown>): UserSentence {
  return {
    id: String(row.id),
    deviceId: String(row.device_id ?? row.deviceId),
    sentence: String(row.sentence),
    translation: String(row.translation),
    context: row.context != null ? String(row.context) : null,
    topic: row.topic != null ? String(row.topic) : null,
  };
}

export function createMockSentenceRepository(): SentenceRepository {
  for (const s of SEED) mockStore.set(s.id, { ...s, deviceId: 'seed' });
  return {
    async list(deviceId) {
      const items = [...mockStore.values()].filter(
        (s) => s.deviceId === deviceId || s.deviceId === 'seed',
      );
      return ok(items.map((s) => ({ ...s, deviceId })));
    },
    async create(deviceId, input) {
      const row: UserSentence = { id: `sent-${Date.now()}`, deviceId, ...input };
      mockStore.set(row.id, row);
      return ok(row);
    },
    async update(id, input) {
      const row = mockStore.get(id);
      if (!row) return err('Không tìm thấy câu.');
      const next = { ...row, ...input };
      mockStore.set(id, next);
      return ok(next);
    },
    async remove(id) {
      mockStore.delete(id);
      return ok(undefined);
    },
  };
}

export function createSupabaseSentenceRepository(client: SupabaseLikeClient): SentenceRepository {
  const mock = createMockSentenceRepository();
  return {
    async list(deviceId) {
      const { data, error } = await fromTable(client, 'user_sentences')
        .select('id, device_id, sentence, translation, context, topic')
        .eq('device_id', deviceId)
        .limit(200);
      if (error) return mock.list(deviceId);
      const rows = (data ?? []) as Record<string, unknown>[];
      if (!rows.length) return mock.list(deviceId);
      return ok(rows.map(mapRow));
    },
    async create(deviceId, input) {
      const { data, error } = await fromTable(client, 'user_sentences')
        .insert({ device_id: deviceId, ...input })
        .select('id, device_id, sentence, translation, context, topic')
        .single();
      if (error) return mock.create(deviceId, input);
      return ok(mapRow(data!));
    },
    async update(id, input) {
      const { data, error } = await fromTable(client, 'user_sentences')
        .update(input)
        .eq('id', id)
        .select('id, device_id, sentence, translation, context, topic')
        .single();
      if (error) return mock.update(id, input);
      return ok(mapRow(data!));
    },
    async remove(id) {
      const { error } = await fromTable(client, 'user_sentences').delete().eq('id', id).limit(1);
      if (error) return mock.remove(id);
      return ok(undefined);
    },
  };
}
