import type { Vocabulary } from '../../fn01_hoc_tu_vung_ngu_canh/domain/vocabulary';

export type ContextReviewQuestion = {
  id: string;
  vocabulary: Vocabulary;
  prompt: string;
  choices: string[];
  correctIndex: number;
};
