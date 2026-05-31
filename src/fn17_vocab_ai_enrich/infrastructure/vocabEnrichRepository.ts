import { ok, type Result } from '../../shared/result';
import type { VocabEnrichRequest, VocabEnrichResult } from '../domain/vocabEnrich';

export type VocabEnrichRepository = {
  enrich(request: VocabEnrichRequest): Promise<Result<VocabEnrichResult>>;
};

const MOCK_DEPLOY: VocabEnrichResult = {
  word: 'deploy',
  meaning: 'triển khai (phần mềm)',
  pronunciation: '/dɪˈplɔɪ/',
  partOfSpeech: 'verb',
  context: 'We will deploy the hotfix after QA signs off.',
  example: 'The team deploys every Friday during the release window.',
  topic: 'Release & Deploy',
  difficultyLevel: 2,
  dialogue: {
    scenario: 'Release planning',
    workplaceRole: 'PM, DEV',
    lines: [
      { speaker: 'PM', text: 'Can we deploy the hotfix before the client demo?' },
      { speaker: 'DEV', text: "Yes, QA signed off — we'll deploy to staging first." },
      { speaker: 'PM', text: 'Ping me once the deploy finishes.' },
    ],
  },
  explanationNative: {
    language: 'vi',
    summary: 'Deploy = triển khai phần mềm lên môi trường chạy thật.',
    usageInContext: 'Dùng khi nói về release, hotfix, staging/production.',
    grammarNotes: 'Thường là động từ: deploy something to somewhere.',
  },
};

export function createMockVocabEnrichRepository(): VocabEnrichRepository {
  return {
    async enrich(request) {
      const base = { ...MOCK_DEPLOY, word: request.word.trim() };
      if (request.mode === 'enrich' && request.meaning?.trim()) {
        base.meaning = request.meaning.trim();
      }
      base.explanationNative = {
        ...MOCK_DEPLOY.explanationNative,
        language: request.nativeLanguage || 'vi',
      };
      return ok(base);
    },
  };
}

export function createSupabaseVocabEnrichRepository(
  invoke: (body: Record<string, unknown>) => Promise<{ data: unknown; error: Error | null }>,
): VocabEnrichRepository {
  const mock = createMockVocabEnrichRepository();
  return {
    async enrich(request) {
      const { data, error } = await invoke({
        mode: request.mode,
        word: request.word,
        meaning: request.meaning ?? null,
        context: request.context ?? null,
        example: request.example ?? null,
        topic: request.topic ?? null,
        workplace_roles: request.workplaceRoles ?? [],
        native_language: request.nativeLanguage,
      });
      if (error || !data) {
        const fallback = await mock.enrich(request);
        return fallback;
      }
      return ok(mapResponse(data as Record<string, unknown>));
    },
  };
}

function mapResponse(raw: Record<string, unknown>): VocabEnrichResult {
  const dialogue = raw.dialogue as VocabEnrichResult['dialogue'];
  const explanationNative = (raw.explanationNative ?? raw.explanation_native) as VocabEnrichResult['explanationNative'];
  return {
    word: String(raw.word ?? ''),
    meaning: String(raw.meaning ?? ''),
    pronunciation: raw.pronunciation != null ? String(raw.pronunciation) : null,
    partOfSpeech: (raw.partOfSpeech ?? raw.part_of_speech) != null ? String(raw.partOfSpeech ?? raw.part_of_speech) : null,
    context: String(raw.context ?? ''),
    example: String(raw.example ?? ''),
    topic: String(raw.topic ?? 'Software Development'),
    difficultyLevel: Number(raw.difficultyLevel ?? raw.difficulty_level ?? 2),
    dialogue,
    explanationNative,
  };
}
