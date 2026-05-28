import type { CollectionItem, LearningCollection } from '../domain/collection';
import type { CollectionRepository } from '../infrastructure/collectionRepository';
import type { Result } from '../../shared/result';

export function listCollections(
  repo: CollectionRepository,
  deviceId: string,
): Promise<Result<LearningCollection[]>> {
  return repo.listCollections(deviceId);
}

export function createCollection(
  repo: CollectionRepository,
  deviceId: string,
  title: string,
  description?: string | null,
): Promise<Result<LearningCollection>> {
  if (!title.trim()) return Promise.resolve({ ok: false, error: 'Tên bộ học không được trống.' });
  return repo.createCollection(deviceId, title.trim(), description ?? null);
}

export function listCollectionItems(
  repo: CollectionRepository,
  collectionId: string,
): Promise<Result<CollectionItem[]>> {
  return repo.listItems(collectionId);
}

export function addToCollection(
  repo: CollectionRepository,
  collectionId: string,
  itemType: CollectionItem['itemType'],
  itemId: string,
): Promise<Result<CollectionItem>> {
  return repo.addItem(collectionId, itemType, itemId);
}

export function deleteCollection(repo: CollectionRepository, id: string): Promise<Result<void>> {
  return repo.deleteCollection(id);
}
