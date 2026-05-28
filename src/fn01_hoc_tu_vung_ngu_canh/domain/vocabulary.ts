export type Vocabulary = {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string | null;
  partOfSpeech: string | null;
  context: string;
  example: string;
  topic: string;
  difficultyLevel: number;
};

/** REQ-01: mỗi từ bắt buộc có context + example + topic. */
export function assertVocabularyHasContext(item: Vocabulary): void {
  if (!item.context?.trim() || !item.example?.trim() || !item.topic?.trim()) {
    throw new Error(`Vocabulary "${item.word}" thiếu context, example hoặc topic.`);
  }
}

export function isValidVocabulary(item: Vocabulary): boolean {
  return Boolean(item.context?.trim() && item.example?.trim() && item.topic?.trim());
}
