import { Duration, Task, Wait } from '@serenity-js/core';
import { Click, Navigate, isVisible } from '@serenity-js/web';
import { HomePage, SplashPage, VocabLearningPage } from '../pages/VocabLearningPage.js';

export const VocabLearning = {
  openViaE2eDeepLink: () =>
    Task.where(
      `#actor opens vocabulary lesson via E2E deep link`,
      Navigate.to('/?e2e=1&screen=fn01_vocabulary'),
      Wait.upTo(Duration.ofSeconds(15)).until(VocabLearningPage.word, isVisible()),
    ),

  openFromHomeFlow: () =>
    Task.where(
      `#actor navigates from splash to vocabulary lesson`,
      Navigate.to('/?e2e=1&screen=splash'),
      Wait.upTo(Duration.ofSeconds(10)).until(SplashPage.startBtn, isVisible()),
      Click.on(SplashPage.startBtn),
      Wait.upTo(Duration.ofSeconds(10)).until(HomePage.startLesson, isVisible()),
      Click.on(HomePage.startLesson),
      Wait.upTo(Duration.ofSeconds(15)).until(VocabLearningPage.word, isVisible()),
    ),

  clickPronunciation: () =>
    Task.where(`#actor taps pronunciation`, Click.on(VocabLearningPage.pronunciationBtn)),
};
