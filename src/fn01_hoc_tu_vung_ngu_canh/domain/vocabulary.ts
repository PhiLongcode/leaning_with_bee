export type VocabularyDialogue = {
  scenario?: string;
  workplaceRole?: string;
  lines: { speaker: string; text: string }[];
};

export type ExplanationNative = {
  language: string;
  summary: string;
  usageInContext: string;
  grammarNotes?: string;
};

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
  dialogue?: VocabularyDialogue | null;
  explanationNative?: ExplanationNative | null;
  /** Ngày trong lộ trình 7 ngày (1–7) */
  lessonDay?: number;
  lessonOrder?: number;
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

/** REQ-01 strict: bắt buộc dialogue 2–5 câu khi strictDialogue = true. */
export function isValidVocabularyWithDialogue(
  item: Vocabulary,
  strictDialogue = false,
): boolean {
  if (!isValidVocabulary(item)) return false;
  if (!strictDialogue) return true;
  const lines = item.dialogue?.lines ?? [];
  return lines.length >= 2 && lines.length <= 5;
}

/** Highlight vị trí từ mục tiêu trong câu hội thoại (UI bubble). */
export function highlightWordInLine(line: string, word: string): { start: number; end: number } | null {
  const pattern = new RegExp(`\\b(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'i');
  const match = pattern.exec(line);
  if (!match || match.index === undefined) return null;
  return { start: match.index, end: match.index + match[1].length };
}
