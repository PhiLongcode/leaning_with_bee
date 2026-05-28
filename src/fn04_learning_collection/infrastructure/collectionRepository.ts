import { DAILY_VOCABULARY_SEED } from '../../fn01_hoc_tu_vung_ngu_canh/data/dailyVocabularySeed';
import { err, ok, type Result } from '../../shared/result';
import { isInvalidUuid } from '../../shared/supabaseErrors';
import { fromTable, type SupabaseLikeClient } from '../../shared/supabaseClient';
import type { CollectionItem, LearningCollection } from '../domain/collection';

export type CollectionRepository = {
  listCollections(deviceId: string): Promise<Result<LearningCollection[]>>;
  createCollection(
    deviceId: string,
    title: string,
    description?: string | null,
  ): Promise<Result<LearningCollection>>;
  deleteCollection(id: string): Promise<Result<void>>;
  listItems(collectionId: string): Promise<Result<CollectionItem[]>>;
  addItem(
    collectionId: string,
    itemType: CollectionItem['itemType'],
    itemId: string,
  ): Promise<Result<CollectionItem>>;
  removeItem(id: string): Promise<Result<void>>;
};

const collections = new Map<string, LearningCollection>();
const items = new Map<string, CollectionItem>();

function mapCollection(row: Record<string, unknown>): LearningCollection {
  return {
    id: String(row.id),
    deviceId: String(row.device_id ?? row.deviceId),
    title: String(row.title),
    description: row.description != null ? String(row.description) : null,
  };
}

function mapItem(row: Record<string, unknown>): CollectionItem {
  return {
    id: String(row.id),
    collectionId: String(row.collection_id ?? row.collectionId),
    itemType: row.item_type as CollectionItem['itemType'],
    itemId: String(row.item_id ?? row.itemId),
  };
}

export function createMockCollectionRepository(): CollectionRepository {
  return {
    async listCollections(deviceId) {
      return ok([...collections.values()].filter((c) => c.deviceId === deviceId));
    },
    async createCollection(deviceId, title, description = null) {
      const c: LearningCollection = {
        id: `col-${Date.now()}`,
        deviceId,
        title,
        description,
      };
      collections.set(c.id, c);
      return ok(c);
    },
    async deleteCollection(id) {
      collections.delete(id);
      for (const [k, v] of items) {
        if (v.collectionId === id) items.delete(k);
      }
      return ok(undefined);
    },
    async listItems(collectionId) {
      return ok([...items.values()].filter((i) => i.collectionId === collectionId));
    },
    async addItem(collectionId, itemType, itemId) {
      const row: CollectionItem = {
        id: `ci-${Date.now()}`,
        collectionId,
        itemType,
        itemId,
      };
      items.set(row.id, row);
      return ok(row);
    },
    async removeItem(id) {
      items.delete(id);
      return ok(undefined);
    },
  };
}

export function createSupabaseCollectionRepository(client: SupabaseLikeClient): CollectionRepository {
  const mock = createMockCollectionRepository();
  return {
    async listCollections(deviceId) {
      const { data, error } = await fromTable(client, 'learning_collections')
        .select('id, device_id, title, description')
        .eq('device_id', deviceId)
        .limit(100);
      if (error) return mock.listCollections(deviceId);
      const rows = (data ?? []) as Record<string, unknown>[];
      if (!rows.length) return mock.listCollections(deviceId);
      return ok(rows.map(mapCollection));
    },
    async createCollection(deviceId, title, description = null) {
      const { data, error } = await fromTable(client, 'learning_collections')
        .insert({ device_id: deviceId, title, description })
        .select('id, device_id, title, description')
        .single();
      if (error) return mock.createCollection(deviceId, title, description);
      return ok(mapCollection(data!));
    },
    async deleteCollection(id) {
      const { error } = await fromTable(client, 'learning_collections').delete().eq('id', id).limit(1);
      if (error) return mock.deleteCollection(id);
      return ok(undefined);
    },
    async listItems(collectionId) {
      const { data, error } = await fromTable(client, 'collection_items')
        .select('id, collection_id, item_type, item_id')
        .eq('collection_id', collectionId)
        .limit(500);
      if (error) return mock.listItems(collectionId);
      return ok(((data ?? []) as Record<string, unknown>[]).map(mapItem));
    },
    async addItem(collectionId, itemType, itemId) {
      if (isInvalidUuid(collectionId)) {
        return mock.addItem(collectionId, itemType, itemId);
      }
      let resolvedItemId = itemId;
      if (itemType === 'vocabulary' && isInvalidUuid(itemId)) {
        const seed = DAILY_VOCABULARY_SEED.find((v) => v.id === itemId);
        if (seed) {
          const lookup = await fromTable(client, 'vocabulary')
            .select('id')
            .eq('word', seed.word)
            .maybeSingle();
          if (lookup.error || !lookup.data) {
            return mock.addItem(collectionId, itemType, itemId);
          }
          resolvedItemId = String((lookup.data as Record<string, unknown>).id);
        } else {
          return mock.addItem(collectionId, itemType, itemId);
        }
      }
      const { data, error } = await fromTable(client, 'collection_items')
        .insert({ collection_id: collectionId, item_type: itemType, item_id: resolvedItemId })
        .select('id, collection_id, item_type, item_id')
        .single();
      if (error) return mock.addItem(collectionId, itemType, itemId);
      return ok(mapItem(data!));
    },
    async removeItem(id) {
      const { error } = await fromTable(client, 'collection_items').delete().eq('id', id).limit(1);
      if (error) return mock.removeItem(id);
      return ok(undefined);
    },
  };
}
