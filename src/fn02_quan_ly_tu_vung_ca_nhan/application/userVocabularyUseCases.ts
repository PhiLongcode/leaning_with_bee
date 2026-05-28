import type { UserVocabulary } from '../domain/userVocabulary';
import type { UserVocabularyRepository } from '../infrastructure/userVocabularyRepository';
import type { Result } from '../../shared/result';

export function listMyVocabulary(
  repo: UserVocabularyRepository,
  deviceId: string,
): Promise<Result<UserVocabulary[]>> {
  return repo.list(deviceId);
}

export function addVocabularyToMyList(
  repo: UserVocabularyRepository,
  deviceId: string,
  vocabId: string,
): Promise<Result<UserVocabulary>> {
  return repo.add(deviceId, vocabId);
}

export function toggleFavorite(
  repo: UserVocabularyRepository,
  id: string,
  value: boolean,
): Promise<Result<UserVocabulary>> {
  return repo.setFavorite(id, value);
}

export function toggleDifficult(
  repo: UserVocabularyRepository,
  id: string,
  value: boolean,
): Promise<Result<UserVocabulary>> {
  return repo.setDifficult(id, value);
}

export function removeFromMyList(
  repo: UserVocabularyRepository,
  id: string,
): Promise<Result<void>> {
  return repo.remove(id);
}
