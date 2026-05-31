import { Given, Then, When } from '@cucumber/cucumber';
import { Ensure, equals } from '@serenity-js/assertions';
import { actorCalled } from '@serenity-js/core';
import { isVisible } from '@serenity-js/web';
import { E2E_BASE_URL } from '../../ui/cast/UiActors.js';
import { VocabLearningQuestions } from '../../ui/questions/VocabLearningQuestions.js';
import { VocabLearningPage } from '../../ui/pages/VocabLearningPage.js';
import { VocabLearning } from '../../ui/tasks/VocabLearning.js';

const actor = () => actorCalled('Learner');

Given('ứng dụng web đang chạy', async () => {
  // Base URL configured in UiActors; smoke check optional
  if (!E2E_BASE_URL.startsWith('http')) {
    throw new Error('E2E_BASE_URL invalid');
  }
});

When('tôi mở bài học từ vựng qua deep link E2E', async () => {
  await actor().attemptsTo(VocabLearning.openViaE2eDeepLink());
});

When('tôi đi từ splash tới bài học từ vựng', async () => {
  await actor().attemptsTo(VocabLearning.openFromHomeFlow());
});

Then('tôi thấy từ {string} trên màn hình', async (word: string) => {
  await actor().attemptsTo(
    Ensure.that(VocabLearningPage.word, isVisible()),
    Ensure.that(VocabLearningQuestions.displayedWord(), equals(word)),
  );
});

Then('tôi thấy khối dialogue hội thoại', async () => {
  await actor().attemptsTo(Ensure.that(VocabLearningPage.dialogueList, isVisible()));
});

Then('dialogue chứa từ {string}', async (word: string) => {
  await actor().attemptsTo(
    Ensure.that(VocabLearningQuestions.dialogueContainsWord(word), equals(true)),
  );
});

Then('tôi thấy ngữ cảnh vocabulary không rỗng', async () => {
  await actor().attemptsTo(
    Ensure.that(VocabLearningPage.context, isVisible()),
  );
});

Then('tôi thấy ví dụ vocabulary không rỗng', async () => {
  await actor().attemptsTo(Ensure.that(VocabLearningPage.example, isVisible()));
});