import type { UserSentence } from '../domain/sentence';
import type { SentenceRepository } from '../infrastructure/sentenceRepository';
import type { Result } from '../../shared/result';

export function listSentences(
  repo: SentenceRepository,
  deviceId: string,
): Promise<Result<UserSentence[]>> {
  return repo.list(deviceId);
}

export function createSentence(
  repo: SentenceRepository,
  deviceId: string,
  input: Omit<UserSentence, 'id' | 'deviceId'>,
): Promise<Result<UserSentence>> {
  if (!input.sentence.trim() || !input.translation.trim()) {
    return Promise.resolve({ ok: false, error: 'Câu và bản dịch không được trống.' });
  }
  return repo.create(deviceId, input);
}

export function deleteSentence(repo: SentenceRepository, id: string): Promise<Result<void>> {
  return repo.remove(id);
}
