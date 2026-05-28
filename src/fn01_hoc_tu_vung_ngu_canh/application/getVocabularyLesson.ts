import type { Vocabulary } from '../domain/vocabulary';
import type { VocabularyRepository } from '../infrastructure/vocabularyRepository';
import type { Result } from '../../shared/result';

export async function getVocabularyLesson(
  repo: VocabularyRepository,
  limit = 10,
): Promise<Result<Vocabulary[]>> {
  return repo.listLessonItems(limit);
}
