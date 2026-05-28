export type LearningProgress = {
  id: string;
  deviceId: string;
  vocabId: string;
  repetitionLevel: number;
  nextReview: string | null;
  accuracy: number | null;
  reviewCount: number;
};
