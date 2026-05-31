/**
 * Đẩy biến AI từ root .env lên Supabase Edge secrets (vocab-enrich).
 * Usage: node scripts/sync-ai-secrets.js
 */
const { spawnSync } = require('child_process');
const { ROOT, loadProjectEnv } = require('./lib/load-env');

loadProjectEnv();

const key = process.env.OPENAI_API_KEY ?? process.env.ANTHROPIC_API_KEY;
const base = process.env.OPENAI_BASE_URL ?? process.env.ANTHROPIC_BASE_URL;
const model =
  process.env.OPENAI_MODEL ??
  process.env.AI_DEFAULT_MODEL ??
  process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;

if (!key) {
  console.error('[sync-ai-secrets] Thiếu OPENAI_API_KEY hoặc ANTHROPIC_API_KEY trong .env');
  process.exit(1);
}

const args = ['supabase', 'secrets', 'set', `OPENAI_API_KEY=${key}`];
if (base) args.push(`OPENAI_BASE_URL=${base}`);
if (model) args.push(`OPENAI_MODEL=${model}`);

console.log('[sync-ai-secrets] npx', args.slice(0, 3).join(' '), '...');
const r = spawnSync('npx', args, { cwd: ROOT, stdio: 'inherit', shell: true });
if (r.status !== 0) process.exit(r.status ?? 1);

const deployFns = ['vocab-enrich', 'ai-conversation', 'speech-practice'];
for (const fn of deployFns) {
  console.log(`[sync-ai-secrets] deploy ${fn}...`);
  const d = spawnSync('npx', ['supabase', 'functions', 'deploy', fn], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: true,
  });
  if (d.status !== 0) process.exit(d.status ?? 1);
}
console.log('[sync-ai-secrets] Done — secrets + functions deployed.');
