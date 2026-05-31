import { Question } from '@serenity-js/core';
import { Text } from '@serenity-js/web';
import { VocabLearningPage } from '../pages/VocabLearningPage.js';

export const VocabLearningQuestions = {
  displayedWord: () =>
    Question.about<string>('displayed vocabulary word', async (actor) =>
      (await Text.of(VocabLearningPage.word).answeredBy(actor)).trim(),
    ),

  dialogueContainsWord: (word: string) =>
    Question.about<boolean>(`dialogue contains "${word}"`, async (actor) => {
      const text = (await Text.of(VocabLearningPage.dialogueList).answeredBy(actor)).toLowerCase();
      return text.includes(word.toLowerCase());
    }),
};
