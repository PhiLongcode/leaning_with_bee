export {
  validateDialogue,
  validateEnrichRequest,
  validateExplanationNative,
  highlightWordInLine,
  type DialogueValidationResult,
} from './domain/vocabValidation';
export {
  SUPPORTED_NATIVE_LANGUAGES,
  NATIVE_LANGUAGE_LABELS,
  isNativeLanguageCode,
  type VocabEnrichMode,
  type VocabEnrichRequest,
  type VocabEnrichResult,
  type NativeLanguageCode,
} from './domain/vocabEnrich';
export {
  createMockVocabEnrichRepository,
  createSupabaseVocabEnrichRepository,
  type VocabEnrichRepository,
} from './infrastructure/vocabEnrichRepository';
export {
  createMockVocabularyWriteRepository,
  createSupabaseVocabularyWriteRepository,
  enrichToVocabularyPayload,
  saveEnrichedVocabulary,
  type VocabularyWriteRepository,
} from './infrastructure/vocabularyWriteRepository';
export { enrichVocabulary } from './application/vocabEnrichUseCases';
