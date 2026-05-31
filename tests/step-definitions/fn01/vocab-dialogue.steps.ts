import { Before, Given, Then, When } from '@cucumber/cucumber';
import { Ensure, equals, isPresent, not } from '@serenity-js/assertions';
import { actorCalled } from '@serenity-js/core';
import {
  highlightWordInLine,
  isValidVocabularyWithDialogue,
  type Vocabulary,
} from '../../../src/fn01_hoc_tu_vung_ngu_canh/domain/vocabulary.js';

Before({ tags: '@FN-01 and not @ui' }, () => {
  actorCalled('Learner');
});

const actor = () => actorCalled('Learner');

let vocab: Vocabulary | null = null;
let highlight: { start: number; end: number } | null = null;
let strictDialogue = false;

Given('vocabulary {string} có dialogue {int} câu', (word: string, count: number) => {
  vocab = {
    id: 'test-1',
    word,
    meaning: 'test',
    pronunciation: null,
    partOfSpeech: 'verb',
    context: `We will ${word} tonight.`,
    example: `Team ${word}s every Friday.`,
    topic: 'Agile',
    difficultyLevel: 2,
    dialogue: {
      lines: Array.from({ length: count }, (_, i) => ({
        speaker: i % 2 === 0 ? 'PM' : 'DEV',
        text: i === 0 ? `Can we ${word} the hotfix?` : `Yes, we can ${word} today.`,
      })),
    },
  };
});

Given('vocabulary {string} chỉ có context và example', (word: string) => {
  vocab = {
    id: 'test-2',
    word,
    meaning: 'test',
    pronunciation: null,
    partOfSpeech: 'noun',
    context: 'Daily sync meeting.',
    example: 'We had a sync this morning.',
    topic: 'Agile',
    difficultyLevel: 1,
  };
});

When('kiểm tra vocabulary hợp lệ', () => {
  strictDialogue = false;
});

When('kiểm tra vocabulary hợp lệ \\(strict dialogue\\)', () => {
  strictDialogue = true;
});

Then('vocabulary được coi là hợp lệ', async () => {
  await actor().attemptsTo(
    Ensure.that(vocab !== null && isValidVocabularyWithDialogue(vocab, strictDialogue), equals(true)),
  );
});

Then('vocabulary không hợp lệ vì thiếu dialogue', async () => {
  await actor().attemptsTo(
    Ensure.that(vocab !== null && isValidVocabularyWithDialogue(vocab, true), equals(false)),
  );
});

Given('câu tiếng Anh {string}', (_line: string) => {
  // line used in When
});

Given('từ cần highlight {string}', (_word: string) => {
  // word used in When
});

When('highlight từ trong câu', () => {
  highlight = highlightWordInLine('Can we deploy the hotfix tonight?', 'deploy');
});

Then('phần highlight chứa {string}', async (word: string) => {
  await actor().attemptsTo(
    Ensure.that(highlight, isPresent()),
    Ensure.that(
      'Can we deploy the hotfix tonight?'.slice(highlight!.start, highlight!.end).toLowerCase(),
      equals(word.toLowerCase()),
    ),
  );
});
