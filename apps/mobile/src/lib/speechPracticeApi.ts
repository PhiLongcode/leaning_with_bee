import { supabase, isSupabaseConfigured } from './supabase';

export type SpeechScoreResult = {
  matchScore: number;
  score: number;
  feedback: string;
  sessionId?: string;
  persisted: boolean;
};

export async function scoreSpeechPractice(
  deviceId: string,
  prompt: string,
  transcript: string,
): Promise<SpeechScoreResult | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.functions.invoke('speech-practice', {
    body: { prompt, transcript },
    headers: { 'X-Device-Id': deviceId },
  });
  if (error || !data) return null;
  const payload = data as SpeechScoreResult;
  if (typeof payload.matchScore !== 'number') return null;
  return payload;
}
