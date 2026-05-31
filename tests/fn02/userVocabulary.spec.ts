import { describe, expect, it } from 'vitest';
import {
  addVocabularyToMyList,
  listMyVocabulary,
  removeFromMyList,
  toggleFavorite,
} from '../../src/fn02_quan_ly_tu_vung_ca_nhan/application/userVocabularyUseCases';
import { createMockUserVocabularyRepository } from '../../src/fn02_quan_ly_tu_vung_ca_nhan/infrastructure/userVocabularyRepository';

describe('FN-02 user vocabulary', () => {
  const repo = createMockUserVocabularyRepository();
  const deviceId = `fn02-test-${Date.now()}`;

  it('adds and lists vocabulary', async () => {
    const added = await addVocabularyToMyList(repo, deviceId, 'day1-1');
    expect(added.ok).toBe(true);
    const list = await listMyVocabulary(repo, deviceId);
    expect(list.ok && list.value.some((u) => u.vocabId === 'day1-1')).toBe(true);
  });

  it('toggles favorite', async () => {
    const added = await addVocabularyToMyList(repo, deviceId, 'day1-2');
    expect(added.ok).toBe(true);
    if (!added.ok) return;
    const fav = await toggleFavorite(repo, added.value.id, true);
    expect(fav.ok && fav.value.isFavorite).toBe(true);
  });

  it('removes from list', async () => {
    const added = await addVocabularyToMyList(repo, deviceId, 'day1-3');
    expect(added.ok).toBe(true);
    if (!added.ok) return;
    const removed = await removeFromMyList(repo, added.value.id);
    expect(removed.ok).toBe(true);
    const list = await listMyVocabulary(repo, deviceId);
    expect(list.ok && !list.value.some((u) => u.id === added.value.id)).toBe(true);
  });
});
