/**
 * Push migrations qua Supabase Management API (cần SUPABASE_ACCESS_TOKEN).
 * Lấy token: npx supabase login  hoặc Dashboard → Account → Access Tokens
 */
const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'wtprvgolyoxrjvutvbsq';
const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');

function getToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN.trim();
  const candidates = [
    path.join(process.env.APPDATA || '', 'supabase', 'access-token'),
    path.join(process.env.USERPROFILE || '', '.supabase', 'access-token'),
    path.join(process.env.HOME || '', '.supabase', 'access-token'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8').trim();
  }
  return null;
}

async function runQuery(token, sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return text;
}

async function main() {
  const token = getToken();
  if (!token) {
    console.error('Thiếu SUPABASE_ACCESS_TOKEN. Chạy: npx supabase login');
    process.exit(1);
  }

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    process.stdout.write(`Applying ${file}... `);
    await runQuery(token, sql);
    console.log('OK');
  }

  const { rows } = JSON.parse(
    await runQuery(token, 'select count(*)::int as n from public.vocabulary;'),
  );
  console.log('vocabulary rows:', rows?.[0]?.n ?? '(see response)');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
