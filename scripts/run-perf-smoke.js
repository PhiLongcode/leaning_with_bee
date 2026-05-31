/**
 * Smoke load FN-17 vocab-enrich (k6).
 * Env: PERF_SUPABASE_URL, PERF_SUPABASE_ANON_KEY (hoặc map từ EXPO_PUBLIC_* trong .env)
 */
const { spawnSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { ROOT, loadProjectEnv } = require('./lib/load-env');

loadProjectEnv();

if (!process.env.PERF_SUPABASE_URL?.trim()) {
  process.env.PERF_SUPABASE_URL =
    process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || '';
}
if (!process.env.PERF_SUPABASE_ANON_KEY?.trim()) {
  process.env.PERF_SUPABASE_ANON_KEY =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';
}

const p95Ms = process.env.PERF_P95_MS || '2000';
const testsDir = path.join(ROOT, 'tests');
const scriptPath = path.join(testsDir, 'perf', 'k6', 'vocab-enrich-smoke.js');
const summaryPath = path.join(testsDir, 'reports', 'k6', 'vocab-enrich-smoke-summary.json');

fs.mkdirSync(path.dirname(summaryPath), { recursive: true });

if (!process.env.PERF_SUPABASE_URL || !process.env.PERF_SUPABASE_ANON_KEY) {
  console.error(
    '[perf] Thiếu PERF_SUPABASE_URL / PERF_SUPABASE_ANON_KEY (hoặc EXPO_PUBLIC_* trong .env)',
  );
  process.exit(1);
}

function k6Native() {
  return spawnSync('k6', ['version'], { shell: true, encoding: 'utf8' }).status === 0;
}

function runNative() {
  return spawnSync(
    'k6',
    ['run', '--summary-export', summaryPath, scriptPath],
    {
      cwd: testsDir,
      stdio: 'inherit',
      env: { ...process.env, PERF_P95_MS: p95Ms },
    },
  );
}

function runDocker() {
  const mount = testsDir.replace(/\\/g, '/');
  let volume = mount;
  if (process.platform === 'win32' && /^[a-zA-Z]:/.test(mount)) {
    volume = `/${mount[0].toLowerCase()}${mount.slice(2)}`;
  }

  const args = [
    'run',
    '--rm',
    '-e',
    `PERF_SUPABASE_URL=${process.env.PERF_SUPABASE_URL}`,
    '-e',
    `PERF_SUPABASE_ANON_KEY=${process.env.PERF_SUPABASE_ANON_KEY}`,
    '-e',
    `PERF_P95_MS=${p95Ms}`,
    '-e',
    `PERF_VUS=${process.env.PERF_VUS || '3'}`,
    '-e',
    `PERF_DURATION=${process.env.PERF_DURATION || '10s'}`,
    '-v',
    `${volume}:/tests`,
    '-w',
    '/tests',
    'grafana/k6',
    'run',
    '--summary-export',
    '/tests/reports/k6/vocab-enrich-smoke-summary.json',
    'perf/k6/vocab-enrich-smoke.js',
  ];

  return spawnSync('docker', args, { stdio: 'inherit', env: process.env });
}

console.log('[perf] vocab-enrich smoke — p95 <', p95Ms, 'ms, error rate < 5%');
console.log('[perf] URL:', process.env.PERF_SUPABASE_URL);

const useDocker = !k6Native();
let result;
if (useDocker) {
  console.log('[perf] k6 CLI không có — dùng Docker grafana/k6');
  result = runDocker();
} else {
  console.log('[perf] k6 CLI');
  result = runNative();
}

if (result.status !== 0) {
  console.error('[perf] FAIL — xem log k6 phía trên');
  process.exit(result.status ?? 1);
}

if (fs.existsSync(summaryPath)) {
  try {
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    const p95 = summary.metrics?.http_req_duration?.values?.['p(95)'];
    const errRate = summary.metrics?.http_req_failed?.values?.rate;
    console.log('[perf] PASS');
    console.log('[perf] p95 (ms):', p95 ?? 'n/a');
    console.log('[perf] error rate:', errRate ?? 'n/a');
    console.log('[perf] summary:', summaryPath);
  } catch {
    console.log('[perf] PASS (summary parse skipped)');
  }
} else {
  console.log('[perf] PASS (no summary file)');
}
