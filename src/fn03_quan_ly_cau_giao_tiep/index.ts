export type { UserSentence } from './domain/sentence';
export {
  listSentences,
  createSentence,
  updateSentence,
  deleteSentence,
} from './application/sentenceUseCases';
export {
  createMockSentenceRepository,
  createSupabaseSentenceRepository,
  type SentenceRepository,
} from './infrastructure/sentenceRepository';
