import { describe, expect, it } from 'vitest';
import {
  addToCollection,
  createCollection,
  listCollectionItems,
  listCollections,
} from '../../src/fn04_learning_collection/application/collectionUseCases';
import { createMockCollectionRepository } from '../../src/fn04_learning_collection/infrastructure/collectionRepository';

describe('FN-04 Collection', () => {
  const repo = createMockCollectionRepository();
  const deviceId = 'dev-col';

  it('rejects empty title', async () => {
    const r = await createCollection(repo, deviceId, '   ');
    expect(r.ok).toBe(false);
  });

  it('creates collection and adds vocabulary item', async () => {
    const col = await createCollection(repo, deviceId, 'Sprint vocab');
    expect(col.ok).toBe(true);
    if (!col.ok) return;
    const item = await addToCollection(repo, col.value.id, 'vocabulary', 'vocab-uuid-1');
    expect(item.ok).toBe(true);
    const items = await listCollectionItems(repo, col.value.id);
    expect(items.ok && items.value.length).toBe(1);
    const list = await listCollections(repo, deviceId);
    expect(list.ok && list.value.some((c) => c.id === col.value.id)).toBe(true);
  });
});
