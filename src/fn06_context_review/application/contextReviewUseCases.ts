import { DAILY_VOCABULARY_SEED } from '../../fn01_hoc_tu_vung_ngu_canh/data/dailyVocabularySeed';
import type { Vocabulary } from '../../fn01_hoc_tu_vung_ngu_canh/domain/vocabulary';
import { ok, type Result } from '../../shared/result';
import type { ContextReviewQuestion } from '../domain/contextReview';

export function buildContextReviewQuiz(limit = 5): Result<ContextReviewQuestion[]> {
  return buildContextReviewQuizFromPool(DAILY_VOCABULARY_SEED.slice(0, limit), DAILY_VOCABULARY_SEED);
}

/** Quiz từ danh sách bài học vừa học (luồng FN-01 → FN-06). */
export function buildContextReviewQuizFromLesson(
  lessonWords: Vocabulary[],
  limit = 5,
): Result<ContextReviewQuestion[]> {
  const pool = lessonWords.length > 0 ? lessonWords : DAILY_VOCABULARY_SEED.slice(0, limit);
  return buildContextReviewQuizFromPool(pool.slice(0, limit), DAILY_VOCABULARY_SEED);
}

function buildContextReviewQuizFromPool(
  pool: Vocabulary[],
  distractorPool: Vocabulary[],
): Result<ContextReviewQuestion[]> {
  const questions: ContextReviewQuestion[] = pool.map((v, i) => {
    const distractors = distractorPool.filter((x) => x.id !== v.id)
      .slice(0, 3)
      .map((x) => x.meaning);
    const choices = shuffle([v.meaning, ...distractors]);
    const correctIndex = choices.indexOf(v.meaning);
    return {
      id: `cr-${i}`,
      vocabulary: v,
      prompt: `Trong câu: "${v.context}" — từ "${v.word}" nghĩa là gì?`,
      choices,
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
    };
  });
  return ok(questions);
}

export function gradeContextReviewAnswer(
  question: ContextReviewQuestion,
  selectedIndex: number,
): Result<{ correct: boolean; xp: number }> {
  const correct = selectedIndex === question.correctIndex;
  return ok({ correct, xp: correct ? 10 : 2 });
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
