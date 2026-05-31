import type { ExplanationNative, VocabularyDialogue } from '../../fn01_hoc_tu_vung_ngu_canh/domain/vocabulary';

export type VocabEnrichMode = 'full' | 'enrich';

export type VocabEnrichRequest = {
  mode: VocabEnrichMode;
  word: string;
  meaning?: string | null;
  context?: string | null;
  example?: string | null;
  topic?: string | null;
  workplaceRoles?: string[];
  nativeLanguage: string;
};

export type VocabEnrichResult = {
  word: string;
  meaning: string;
  pronunciation: string | null;
  partOfSpeech: string | null;
  context: string;
  example: string;
  topic: string;
  difficultyLevel: number;
  dialogue: VocabularyDialogue;
  explanationNative: ExplanationNative;
};

export const SUPPORTED_NATIVE_LANGUAGES = ['vi', 'en', 'zh', 'ja', 'ko'] as const;
export type NativeLanguageCode = (typeof SUPPORTED_NATIVE_LANGUAGES)[number];

export const NATIVE_LANGUAGE_LABELS: Record<NativeLanguageCode, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
};

export function isNativeLanguageCode(code: string): code is NativeLanguageCode {
  return (SUPPORTED_NATIVE_LANGUAGES as readonly string[]).includes(code);
}
