import type { Vocabulary } from '../domain/vocabulary';

export const MOCK_VOCABULARIES: Vocabulary[] = [
  {
    id: 'mock-deploy',
    word: 'deploy',
    meaning: 'triển khai (phần mềm lên môi trường chạy)',
    pronunciation: '/dɪˈplɔɪ/',
    partOfSpeech: 'verb',
    context: 'We will deploy the hotfix to production after QA signs off.',
    example: 'The team deploys every Friday during the release window.',
    topic: 'Software Development',
    difficultyLevel: 2,
  },
  {
    id: 'mock-stakeholder',
    word: 'stakeholder',
    meaning: 'bên liên quan',
    pronunciation: '/ˈsteɪkˌhoʊldər/',
    partOfSpeech: 'noun',
    context: 'Please loop in stakeholders before we change the timeline.',
    example: 'Stakeholders reviewed the roadmap in yesterday’s sync.',
    topic: 'Workplace Communication',
    difficultyLevel: 2,
  },
  {
    id: 'mock-blocker',
    word: 'blocker',
    meaning: 'vấn đề chặn tiến độ',
    pronunciation: '/ˈblɒkər/',
    partOfSpeech: 'noun',
    context: 'There is a blocker on the API integration — we need credentials.',
    example: 'She flagged the dependency as a blocker in stand-up.',
    topic: 'Agile / Scrum',
    difficultyLevel: 1,
  },
];
