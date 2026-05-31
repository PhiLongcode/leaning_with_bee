import { By, PageElement } from '@serenity-js/web';

/** Page Object — màn học từ vựng FN-01 (Ubiquitous Language = requirement). */
export const VocabLearningPage = {
  word: PageElement.located(By.css('[data-testid="vocab-word"]')).describedAs('vocabulary word'),
  context: PageElement.located(By.css('[data-testid="vocab-context"]')).describedAs('vocabulary context'),
  example: PageElement.located(By.css('[data-testid="vocab-example"]')).describedAs('vocabulary example'),
  dialogueList: PageElement.located(By.css('[data-testid="dialogue-bubble-list"]')).describedAs('dialogue bubble list'),
  explanationCard: PageElement.located(By.css('[data-testid="explanation-native-card"]')).describedAs('explanation native card'),
  pronunciationBtn: PageElement.located(By.css('[data-testid="vocab-pronunciation-btn"]')).describedAs('pronunciation button'),
};

export const HomePage = {
  startLesson: PageElement.located(By.css('[data-testid="home-start-lesson"]')).describedAs('start lesson hero'),
  featureFn01: PageElement.located(By.css('[data-testid="feature-row-fn01_vocabulary"]')).describedAs('FN-01 feature row'),
};

export const SplashPage = {
  startBtn: PageElement.located(By.css('[data-testid="splash-start-btn"]')).describedAs('splash start button'),
};
