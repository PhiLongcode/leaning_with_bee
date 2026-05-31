import { Before, Given, Then, When } from '@cucumber/cucumber';
import { Ensure, equals, isGreaterThan } from '@serenity-js/assertions';
import { actorCalled } from '@serenity-js/core';
import {
  createMockVocabEnrichRepository,
  enrichVocabulary,
  type VocabEnrichResult,
} from '../../../src/fn17_vocab_ai_enrich/index.js';

Before({ tags: '@FN-02' }, () => {
  actorCalled('Learner');
});

const actor = () => actorCalled('Learner');

let enrichResult: VocabEnrichResult | null = null;
let enrichError: string | null = null;

Given('mock enrich cho word {string} ngôn ngữ {string}', (_word: string, _lang: string) => {
  // uses mock repo in When
});

When('gọi enrich vocabulary', async () => {
  const repo = createMockVocabEnrichRepository();
  const result = await enrichVocabulary(repo, {
    mode: 'full',
    word: 'deploy',
    nativeLanguage: 'vi',
  });
  if (result.ok) {
    enrichResult = result.value;
    enrichError = null;
  } else {
    enrichError = result.error;
    enrichResult = null;
  }
});

Then('kết quả có dialogue ít nhất {int} câu', async (min: number) => {
  await actor().attemptsTo(
    Ensure.that(enrichResult?.dialogue.lines.length ?? 0, isGreaterThan(min - 1)),
  );
});

Then('kết quả có explanationNative ngôn ngữ {string}', async (lang: string) => {
  await actor().attemptsTo(
    Ensure.that(enrichResult?.explanationNative.language, equals(lang)),
  );
});
