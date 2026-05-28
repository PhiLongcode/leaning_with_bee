const fs = require('fs');
const path = require('path');

const sql = fs.readFileSync(
  path.join(__dirname, '..', 'supabase', 'migrations', '20260529120100_seed_7_day_vocabulary.sql'),
  'utf8',
);

const re =
  /\('([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',\s*'([^']*)',\s*(\d+),\s*(\d+),\s*(\d+)\)/g;

const un = (s) => s.replace(/''/g, "'");
const words = [];
let m;
while ((m = re.exec(sql))) {
  words.push({
    id: `day${m[9]}-${m[10]}`,
    word: un(m[1]),
    meaning: un(m[2]),
    pronunciation: m[3],
    partOfSpeech: m[4],
    context: un(m[5]),
    example: un(m[6]),
    topic: un(m[7]),
    difficultyLevel: Number(m[8]),
    lessonDay: Number(m[9]),
    lessonOrder: Number(m[10]),
  });
}

const header = `import type { Vocabulary } from '../domain/vocabulary';

export type VocabularySeed = Vocabulary & { lessonDay: number; lessonOrder: number };

/** 7 ngày × 10 từ — đồng bộ với supabase/migrations/20260529120100_seed_7_day_vocabulary.sql */
export const DAILY_VOCABULARY_SEED: VocabularySeed[] = `;

const out =
  header + JSON.stringify(words, null, 2) + ';\n';

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'fn01_hoc_tu_vung_ngu_canh', 'data', 'dailyVocabularySeed.ts'),
  out,
);
console.log('Generated', words.length, 'words');
