export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

/** Khoảng cách ôn (ngày) theo mức Leitner đơn giản */
const DAY_INTERVALS: Record<ReviewRating, number> = {
  again: 0,
  hard: 1,
  good: 3,
  easy: 7,
};

export function scheduleAfterReview(
  rating: ReviewRating,
  repetitionLevel: number,
): { repetitionLevel: number; nextReview: string } {
  const level =
    rating === 'again' ? 0 : rating === 'hard' ? Math.max(0, repetitionLevel) : repetitionLevel + 1;
  const days = DAY_INTERVALS[rating];
  const next = new Date();
  next.setDate(next.getDate() + days);
  next.setHours(9, 0, 0, 0);
  return { repetitionLevel: level, nextReview: next.toISOString() };
}

export function isDue(nextReview: string | null): boolean {
  if (!nextReview) return true;
  return new Date(nextReview).getTime() <= Date.now();
}
