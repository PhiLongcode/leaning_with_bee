export type UserSentence = {
  id: string;
  deviceId: string;
  sentence: string;
  translation: string;
  context: string | null;
  topic: string | null;
};
