import type { ReviewRating } from '../../shared/srs';
import type { LearningProgress } from '../domain/learningProgress';
import type { LearningProgressRepository, ProgressWithVocab } from '../infrastructure/learningProgressRepository';
import type { Result } from '../../shared/result';

export function getDueReviews(
  repo: LearningProgressRepository,
  deviceId: string,
): Promise<Result<ProgressWithVocab[]>> {
  return repo.listDue(deviceId);
}

export function submitReview(
  repo: LearningProgressRepository,
  deviceId: string,
  vocabId: string,
  rating: ReviewRating,
): Promise<Result<LearningProgress>> {
  return repo.submitReview(deviceId, vocabId, rating);
}
