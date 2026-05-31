import { Given, Then, When } from '@cucumber/cucumber';
import { Ensure, equals, isPresent, not } from '@serenity-js/assertions';
import { Actor, actorCalled } from '@serenity-js/core';
import {
  validateDialogue,
  validateEnrichRequest,
  validateExplanationNative,
} from '../../../src/fn17_vocab_ai_enrich/domain/vocabValidation.js';
import type { VocabularyDialogue } from '../../../src/fn01_hoc_tu_vung_ngu_canh/domain/vocabulary.js';

const actor = () => actorCalled('Learner');

let lastWord = '';
let lastDialogue: VocabularyDialogue = { lines: [] };
let lastValidation: { valid: boolean; reason?: string } = { valid: false };
let enrichRequest: {
  mode: 'full' | 'enrich';
  word: string;
  meaning?: string;
  context?: string;
  example?: string;
} = { mode: 'full', word: '' };

function buildDialogue(word: string, lineCount: number, speakers: string[]): VocabularyDialogue {
  const speakerList = speakers.map((s) => s.trim()).filter(Boolean);
  const lines = Array.from({ length: lineCount }, (_, i) => ({
    speaker: speakerList[i % speakerList.length] ?? 'PM',
    text:
      i === 0
        ? `Can we ${word} the hotfix before the demo?`
        : `Let's ${word} after QA signs off.`,
  }));
  return { scenario: 'Release', workplaceRole: speakerList.join(','), lines };
}

Given('từ mục tiêu {string}', (word: string) => {
  lastWord = word;
});

Given('dialogue có {int} câu với speakers {string}', (lineCount: number, speakers: string) => {
  lastDialogue = buildDialogue(lastWord, lineCount, speakers.split(','));
});

When('validate dialogue theo quy tắc REQ-01', () => {
  lastValidation = validateDialogue(lastWord, lastDialogue);
});

Then('kết quả validate là {string}', async (result: string) => {
  const expectedValid = result === 'valid';
  await actor().attemptsTo(
    Ensure.that(lastValidation.valid, equals(expectedValid)),
  );
});

Given('mode enrich với word {string}', (word: string) => {
  enrichRequest = { mode: 'enrich', word };
});

Given('user không nhập meaning, context hay example', () => {
  enrichRequest = { ...enrichRequest, meaning: undefined, context: undefined, example: undefined };
});

Given('user nhập meaning {string}', (meaning: string) => {
  enrichRequest = { ...enrichRequest, meaning };
});

When('kiểm tra request enrich', () => {
  lastValidation = validateEnrichRequest({
    mode: enrichRequest.mode,
    word: enrichRequest.word,
    meaning: enrichRequest.meaning ?? null,
    context: enrichRequest.context ?? null,
    example: enrichRequest.example ?? null,
    nativeLanguage: 'vi',
  });
});

Then('request enrich bị từ chối', async () => {
  await actor().attemptsTo(Ensure.that(lastValidation.valid, equals(false)));
});

Then('request enrich được chấp nhận', async () => {
  await actor().attemptsTo(Ensure.that(lastValidation.valid, equals(true)));
});

Given('explanation native ngôn ngữ {string}', (_lang: string) => {
  // stored in next steps
});

Given('summary {string}', (summary: string) => {
  (globalThis as { __exp?: { summary: string } }).__exp = { summary };
});

Given('usageInContext {string}', (usage: string) => {
  const g = globalThis as { __exp?: { summary: string; usageInContext?: string } };
  g.__exp = { ...g.__exp, summary: g.__exp?.summary ?? '', usageInContext: usage };
});

When('validate explanation native', () => {
  const g = globalThis as {
    __exp?: { summary: string; usageInContext?: string };
  };
  lastValidation = validateExplanationNative({
    language: 'vi',
    summary: g.__exp?.summary ?? '',
    usageInContext: g.__exp?.usageInContext ?? '',
  });
});

Then('explanation native hợp lệ', async () => {
  await actor().attemptsTo(Ensure.that(lastValidation.valid, equals(true)));
});

Given('mode full với word {string}', (word: string) => {
  enrichRequest = { mode: 'full', word };
});
