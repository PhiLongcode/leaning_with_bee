const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

/** Đọc KEY=VALUE từ .env (không ghi đè biến đã có trong process.env). */
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function loadProjectEnv() {
  loadEnvFile(path.join(ROOT, '.env'));
  loadEnvFile(path.join(ROOT, 'apps', 'mobile', '.env.development'));
  loadEnvFile(path.join(ROOT, 'apps', 'mobile', '.env'));
  loadEnvFile(path.join(ROOT, '.env.local'));
}

function projectRefFromUrl(url) {
  if (!url) return null;
  const m = url.match(/https?:\/\/([a-z0-9]+)\.supabase\.co/i);
  return m ? m[1] : null;
}

function getProjectRef() {
  return (
    process.env.SUPABASE_PROJECT_REF?.trim() ||
    projectRefFromUrl(process.env.EXPO_PUBLIC_SUPABASE_URL) ||
    projectRefFromUrl(process.env.SUPABASE_URL) ||
    'wtprvgolyoxrjvutvbsq'
  );
}

module.exports = { ROOT, loadProjectEnv, getProjectRef, projectRefFromUrl };
