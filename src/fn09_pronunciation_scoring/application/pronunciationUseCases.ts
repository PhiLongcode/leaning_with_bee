import { ok, type Result } from '../../shared/result';
import { pronunciationFeedback, similarityScore } from '../../shared/textMatch';
import type { PronunciationScore } from '../domain/pronunciationScore';

export function scorePronunciation(
  sessionId: string,
  expected: string,
  transcript: string,
): Result<PronunciationScore> {
  const score = similarityScore(expected, transcript);
  const word = expected.split(' ')[0] ?? 'phrase';
  return ok({
    sessionId,
    word,
    score,
    feedback: pronunciationFeedback(score),
  });
}
