import type { VocabularyDialogue, ExplanationNative } from '../../fn01_hoc_tu_vung_ngu_canh/domain/vocabulary';
import { highlightWordInLine } from '../../fn01_hoc_tu_vung_ngu_canh/domain/vocabulary';
import type { VocabEnrichRequest } from './vocabEnrich';

export { highlightWordInLine };

export type DialogueValidationResult =
  | { valid: true }
  | { valid: false; reason: string };

export function validateDialogue(
  word: string,
  dialogue: VocabularyDialogue,
): DialogueValidationResult {
  const lines = dialogue.lines ?? [];
  if (lines.length < 2 || lines.length > 5) {
    return { valid: false, reason: 'dialogue cần 2–5 câu' };
  }

  const speakers = new Set<string>();
  let wordFound = false;
  const wordLower = word.trim().toLowerCase();
  const wordPattern = new RegExp(`\\b${wordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');

  for (const line of lines) {
    if (!line.speaker?.trim() || !line.text?.trim()) {
      return { valid: false, reason: 'mỗi câu cần speaker và text' };
    }
    speakers.add(line.speaker.trim().toLowerCase());
    if (wordPattern.test(line.text)) wordFound = true;
  }

  if (speakers.size < 2) {
    return { valid: false, reason: 'cần ít nhất 2 speaker khác nhau' };
  }
  if (!wordFound) {
    return { valid: false, reason: 'từ mục tiêu phải xuất hiện trong dialogue' };
  }

  return { valid: true };
}

export function validateExplanationNative(explanation: ExplanationNative): DialogueValidationResult {
  if (!explanation.language?.trim()) {
    return { valid: false, reason: 'thiếu language' };
  }
  if (!explanation.summary?.trim()) {
    return { valid: false, reason: 'thiếu summary' };
  }
  if (!explanation.usageInContext?.trim()) {
    return { valid: false, reason: 'thiếu usageInContext' };
  }
  return { valid: true };
}

export function validateEnrichRequest(req: VocabEnrichRequest): DialogueValidationResult {
  if (!req.word?.trim()) {
    return { valid: false, reason: 'word bắt buộc' };
  }
  if (req.mode === 'enrich') {
    const hasPartial =
      Boolean(req.meaning?.trim()) ||
      Boolean(req.context?.trim()) ||
      Boolean(req.example?.trim());
    if (!hasPartial) {
      return { valid: false, reason: 'enrich mode cần ít nhất meaning, context hoặc example' };
    }
  }
  return { valid: true };
}
