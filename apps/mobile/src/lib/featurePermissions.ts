import type { AppSystemPermissions } from '@hoc-cung-bee/features';
import type { Screen } from '../navigation/screens';

const SCREEN_PERMISSION: Partial<Record<Screen, keyof AppSystemPermissions>> = {
  fn02_vocab_manage: 'allowUserVocabCrud',
  fn03_sentences: 'allowUserVocabCrud',
  fn04_collection: 'allowUserVocabCrud',
  fn07_ai_chat: 'allowAiTutor',
};

export function isScreenAllowed(screen: Screen, permissions: AppSystemPermissions): boolean {
  const key = SCREEN_PERMISSION[screen];
  if (!key) return true;
  return permissions[key];
}
