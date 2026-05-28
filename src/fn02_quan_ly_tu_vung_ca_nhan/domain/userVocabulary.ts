import type { Vocabulary } from '../../fn01_hoc_tu_vung_ngu_canh/domain/vocabulary';

export type UserVocabulary = {
  id: string;
  deviceId: string;
  vocabId: string;
  isFavorite: boolean;
  isDifficult: boolean;
  vocabulary?: Vocabulary;
};
