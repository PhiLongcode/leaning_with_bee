export type SpeechSession = {
  id: string;
  deviceId: string;
  prompt: string;
  transcript: string | null;
  startedAt: string;
};
