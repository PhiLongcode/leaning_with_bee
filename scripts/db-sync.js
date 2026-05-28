/**
 * Đồng bộ schema + seed lên Supabase remote.
 *
 * Cách 1 (khuyến nghị): SUPABASE_ACCESS_TOKEN hoặc `npx supabase login`
 * Cách 2: SUPABASE_DB_PASSWORD hoặc DATABASE_URL (postgres trực tiếp)
 *
 * Tự động khi chạy mobile:dev (flag --auto).
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { ROOT, loadProjectEnv, getProjectRef } = require('./lib/load-env');

loadProjectEnv();

const ARGS = process.argv.slice(2);
const AUTO = ARGS.includes('--auto');
const QUIET = ARGS.includes('--quiet') || AUTO;
const FORCE = ARGS.includes('--force');
const USE_APPLY_ALL = ARGS.includes('--apply-all');

const MIGRATIONS_DIR = path.join(ROOT, 'supabase', 'migrations');
const APPLY_ALL = path.join(ROOT, 'supabase', 'apply-all.sql');

const PREAMBLE = `
create table if not exists public.schema_deployments (
  name text primary key,
  applied_at timestamptz not null default now()
);
`.trim();

function log(...a) {
  if (!QUIET) console.log(...a);
}

function warn(...a) {
  console.warn(...a);
}

function getAccessToken() {
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

function getDatabaseUrlCandidates() {
  if (process.env.DATABASE_URL) return [process.env.DATABASE_URL.trim()];
  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  const ref = getProjectRef();
  if (!password) return [];

  const region = process.env.SUPABASE_DB_REGION || 'ap-southeast-1';
  const enc = encodeURIComponent(password);
  const poolerHost = process.env.SUPABASE_DB_HOST || `aws-0-${region}.pooler.supabase.com`;
  const poolerPort = process.env.SUPABASE_DB_PORT || '6543';
  const poolerSessionPort = process.env.SUPABASE_DB_SESSION_PORT || '5432';

  const urls = [
    `postgresql://postgres.${ref}:${enc}@${poolerHost}:${poolerPort}/postgres`,
    `postgresql://postgres.${ref}:${enc}@${poolerHost}:${poolerSessionPort}/postgres`,
    `postgresql://postgres:${enc}@db.${ref}.supabase.co:5432/postgres`,
  ];
  return [...new Set(urls)];
}

function getPgClientConfig(connectionString) {
  try {
    const u = new URL(connectionString);
    return {
      host: u.hostname,
      port: Number(u.port || 5432),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, '') || 'postgres',
      ssl: { rejectUnauthorized: false },
    };
  } catch {
    return { connectionString, ssl: { rejectUnauthorized: false } };
  }
}

async function managementQuery(projectRef, token, sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`Management API HTTP ${res.status}: ${text.slice(0, 500)}`);
    err.status = res.status;
    throw err;
  }
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function isMigrationApplied(token, projectRef, name) {
  if (FORCE) return false;
  try {
    const result = await managementQuery(
      projectRef,
      token,
      `select 1 as ok from public.schema_deployments where name = '${name.replace(/'/g, "''")}' limit 1;`,
    );
    const rows = result?.result ?? result?.data ?? result?.rows;
    if (Array.isArray(rows) && rows.length > 0) return true;
    if (Array.isArray(result) && result.length > 0) return true;
    return false;
  } catch (e) {
    if (String(e.message).includes('schema_deployments') || String(e.message).includes('does not exist')) {
      return false;
    }
    throw e;
  }
}

async function markMigrationApplied(token, projectRef, name) {
  const safe = name.replace(/'/g, "''");
  await managementQuery(
    projectRef,
    token,
    `insert into public.schema_deployments (name) values ('${safe}') on conflict (name) do nothing;`,
  );
}

function listMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
}

async function syncViaManagementApi() {
  const token = getAccessToken();
  if (!token) return { ok: false, reason: 'no_token' };

  const projectRef = getProjectRef();
  log(`[db-sync] Project: ${projectRef} (Management API)`);

  await managementQuery(projectRef, token, PREAMBLE);

  const files = USE_APPLY_ALL ? ['apply-all.sql'] : listMigrationFiles();
  const sqlSources = USE_APPLY_ALL
    ? [{ name: 'apply-all.sql', sql: fs.readFileSync(APPLY_ALL, 'utf8') }]
    : files.map((f) => ({
        name: f,
        sql: fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf8'),
      }));

  for (const { name, sql } of sqlSources) {
    if (!USE_APPLY_ALL && (await isMigrationApplied(token, projectRef, name))) {
      log(`  skip ${name} (đã áp dụng)`);
      continue;
    }
    process.stdout.write(`  apply ${name}... `);
    await managementQuery(projectRef, token, sql);
    if (!USE_APPLY_ALL) await markMigrationApplied(token, projectRef, name);
    console.log('OK');
  }

  const check = await managementQuery(
    projectRef,
    token,
    'select count(*)::int as n from public.vocabulary;',
  );
  const n =
    check?.result?.[0]?.n ??
    check?.[0]?.n ??
    check?.data?.[0]?.n ??
    '(unknown)';
  log(`[db-sync] vocabulary rows: ${n}`);
  return { ok: true };
}

async function syncViaPostgres() {
  let pg;
  try {
    pg = require('pg');
  } catch {
    return { ok: false, reason: 'no_pg' };
  }

  const urls = getDatabaseUrlCandidates();
  if (!urls.length) return { ok: false, reason: 'no_db_url' };

  let client;
  let lastErr;
  for (const connectionString of urls) {
    const c = new pg.Client(getPgClientConfig(connectionString));
    try {
      await c.connect();
      client = c;
      log(`[db-sync] Postgres (${getProjectRef()})`);
      break;
    } catch (e) {
      lastErr = e;
      await c.end().catch(() => {});
    }
  }
  if (!client) {
    const err = new Error(lastErr?.message || 'Postgres connect failed');
    err.cause = lastErr;
    throw err;
  }

  try {
    await client.query(PREAMBLE);

    const files = USE_APPLY_ALL ? ['apply-all.sql'] : listMigrationFiles();
    const sources = USE_APPLY_ALL
      ? [{ name: 'apply-all.sql', sql: fs.readFileSync(APPLY_ALL, 'utf8') }]
      : files.map((f) => ({
          name: f,
          sql: fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf8'),
        }));

    for (const { name, sql } of sources) {
      if (!USE_APPLY_ALL && !FORCE) {
        const { rows } = await client.query(
          'select 1 from public.schema_deployments where name = $1',
          [name],
        );
        if (rows.length > 0) {
          log(`  skip ${name} (đã áp dụng)`);
          continue;
        }
      }
      process.stdout.write(`  apply ${name}... `);
      await client.query(sql);
      if (!USE_APPLY_ALL) {
        await client.query(
          'insert into public.schema_deployments (name) values ($1) on conflict (name) do nothing',
          [name],
        );
      }
      console.log('OK');
    }

    const { rows } = await client.query('select count(*)::int as n from public.vocabulary');
    log(`[db-sync] vocabulary rows: ${rows[0]?.n ?? 0}`);
    return { ok: true };
  } finally {
    await client.end();
  }
}

function syncViaCli() {
  const token = getAccessToken();
  if (!token) return { ok: false, reason: 'no_token' };

  const linkFile = path.join(ROOT, 'supabase', '.temp', 'project-ref');
  const linkedRef = fs.existsSync(linkFile)
    ? fs.readFileSync(linkFile, 'utf8').trim()
    : null;
  const ref = getProjectRef();

  if (linkedRef !== ref) {
    log(`[db-sync] supabase link --project-ref ${ref}`);
    const link = spawnSync('npx', ['supabase', 'link', '--project-ref', ref], {
      cwd: ROOT,
      stdio: QUIET ? 'pipe' : 'inherit',
      shell: true,
      env: { ...process.env, SUPABASE_ACCESS_TOKEN: token },
    });
    if (link.status !== 0) return { ok: false, reason: 'link_failed' };
  }

  log('[db-sync] supabase db push');
  const push = spawnSync('npx', ['supabase', 'db', 'push'], {
    cwd: ROOT,
    stdio: QUIET ? 'pipe' : 'inherit',
    shell: true,
    env: { ...process.env, SUPABASE_ACCESS_TOKEN: token },
  });
  if (push.status !== 0) return { ok: false, reason: 'push_failed' };
  return { ok: true };
}

async function main() {
  if (AUTO && !getAccessToken() && !getDatabaseUrlCandidates().length) {
    warn(
      '[db-sync] Bỏ qua (chưa có SUPABASE_ACCESS_TOKEN hoặc SUPABASE_DB_PASSWORD). Chạy: npm run db:sync',
    );
    return;
  }

  log('[db-sync] Đồng bộ schema lên Supabase...');

  const attempts = [];

  if (getAccessToken()) {
    attempts.push(['Management API', () => syncViaManagementApi()]);
    attempts.push(['Supabase CLI', () => Promise.resolve(syncViaCli())]);
  }
  if (getDatabaseUrlCandidates().length) {
    attempts.push(['Postgres', () => syncViaPostgres()]);
  }

  let lastError;
  for (const [label, fn] of attempts) {
    try {
      const result = await fn();
      if (result.ok) {
        log('[db-sync] Hoàn tất.');
        return;
      }
      lastError = result.reason;
      log(`[db-sync] ${label}: không dùng được (${result.reason})`);
    } catch (e) {
      lastError = e.message;
      log(`[db-sync] ${label}: lỗi — ${e.message}`);
    }
  }

  const hint =
    'Mạng không kết nối được db.*.supabase.co (IPv6) hoặc pooler sai region/mật khẩu. ' +
    'Dashboard → Project Settings → Database: copy Session pooler URL + region vào SUPABASE_DB_REGION / DATABASE_URL. ' +
    'Hoặc SQL Editor → dán supabase/apply-all.sql → Run.';
  const msg = `Không đồng bộ được schema. ${lastError ? `(${lastError}) ` : ''}${hint}`;
  if (AUTO) {
    warn(`[db-sync] ${msg}`);
    return;
  }
  console.error(msg);
  process.exit(1);
}

main().catch((err) => {
  console.error('[db-sync]', err.message);
  if (!AUTO) process.exit(1);
});
