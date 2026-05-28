import type { LearningDayMeta } from '../data/learningDaysMeta';
import type { Vocabulary } from '../domain/vocabulary';
import type { VocabularyRepository } from '../infrastructure/vocabularyRepository';
import type { Result } from '../../shared/result';

export function listLearningDays(repo: VocabularyRepository): Promise<Result<LearningDayMeta[]>> {
  return repo.listLessonDays();
}

export async function getVocabularyLesson(
  repo: VocabularyRepository,
  lessonDay: number,
  limit = 10,
): Promise<Result<Vocabulary[]>> {
  if (lessonDay < 1 || lessonDay > 7) {
    return { ok: false, error: 'Ngày học phải từ 1 đến 7.' };
  }
  return repo.listLessonItems(lessonDay, limit);
}
