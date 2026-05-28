import { ok, type Result } from '../../shared/result';
import { similarityScore } from '../../shared/textMatch';
import type { SpeechSession } from '../domain/speechSession';

const sessions = new Map<string, SpeechSession>();

export const SPEECH_PROMPTS = [
  'We will deploy the hotfix to production after QA signs off.',
  'There is a blocker on the API integration.',
  'Let us keep the daily sync under fifteen minutes.',
];

export function startSpeechSession(deviceId: string, prompt: string): Result<SpeechSession> {
  const session: SpeechSession = {
    id: `speech-${Date.now()}`,
    deviceId,
    prompt,
    transcript: null,
    startedAt: new Date().toISOString(),
  };
  sessions.set(session.id, session);
  return ok(session);
}

export function submitSpeechTranscript(
  sessionId: string,
  transcript: string,
): Result<{ session: SpeechSession; matchScore: number }> {
  const session = sessions.get(sessionId);
  if (!session) return { ok: false, error: 'Không tìm thấy phiên luyện nói.' };
  const matchScore = similarityScore(session.prompt, transcript);
  const updated = { ...session, transcript };
  sessions.set(sessionId, updated);
  return ok({ session: updated, matchScore });
}

export function getSpeechSession(sessionId: string): Result<SpeechSession> {
  const session = sessions.get(sessionId);
  if (!session) return { ok: false, error: 'Không tìm thấy phiên.' };
  return ok(session);
}
