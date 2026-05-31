import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const testsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(testsRoot, '..');

loadPerfEnvFromDotenv();

function loadPerfEnvFromDotenv(): void {
  const envPath = join(repoRoot, '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
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
  if (!process.env.PERF_SUPABASE_URL?.trim()) {
    process.env.PERF_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
  }
  if (!process.env.PERF_SUPABASE_ANON_KEY?.trim()) {
    process.env.PERF_SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';
  }
}

export type K6RunResult = {
  exitCode: number;
  summaryPath: string;
  p95Ms: number | null;
  errorRate: number | null;
  skipped: boolean;
  reason?: string;
};

export function isK6Installed(): boolean {
  const r = spawnSync('k6', ['version'], { shell: true, encoding: 'utf8' });
  return r.status === 0;
}

export function isPerfEnvConfigured(): boolean {
  return Boolean(process.env.PERF_SUPABASE_URL?.trim() && process.env.PERF_SUPABASE_ANON_KEY?.trim());
}

export function runK6Script(scriptRelativePath: string): K6RunResult {
  const reportsDir = join(testsRoot, 'reports', 'k6');
  mkdirSync(reportsDir, { recursive: true });

  const scriptPath = join(testsRoot, 'perf', 'k6', scriptRelativePath);
  const summaryPath = join(reportsDir, `${scriptRelativePath.replace(/\.js$/, '')}-summary.json`);

  if (!isPerfEnvConfigured()) {
    return {
      exitCode: 0,
      summaryPath,
      p95Ms: null,
      errorRate: null,
      skipped: true,
      reason: 'Thiếu PERF_SUPABASE_URL / PERF_SUPABASE_ANON_KEY',
    };
  }

  const exitCode = isK6Installed()
    ? runK6Native(summaryPath, scriptPath)
    : runK6Docker(summaryPath);

  if (exitCode !== 0) {
    const metrics = readK6Metrics(summaryPath);
    return { exitCode, summaryPath, ...metrics, skipped: false };
  }

  const metrics = readK6Metrics(summaryPath);
  writeFileSync(
    join(reportsDir, 'latest-run.json'),
    JSON.stringify({ script: scriptRelativePath, ...metrics, at: new Date().toISOString() }, null, 2),
  );
  return { exitCode: 0, summaryPath, ...metrics, skipped: false };
}

function runK6Native(summaryPath: string, scriptPath: string): number {
  const r = spawnSync('k6', ['run', '--summary-export', summaryPath, scriptPath], {
    stdio: 'inherit',
    cwd: testsRoot,
    env: process.env,
  });
  return r.status ?? 1;
}

function runK6Docker(summaryPath: string): number {
  const mount = testsRoot.replace(/\\/g, '/');
  let volume = mount;
  if (process.platform === 'win32' && /^[a-zA-Z]:/.test(mount)) {
    volume = `/${mount[0].toLowerCase()}${mount.slice(2)}`;
  }
  const relSummary = 'reports/k6/vocab-enrich-smoke-summary.json';
  const r = spawnSync(
    'docker',
    [
      'run',
      '--rm',
      '-e',
      `PERF_SUPABASE_URL=${process.env.PERF_SUPABASE_URL}`,
      '-e',
      `PERF_SUPABASE_ANON_KEY=${process.env.PERF_SUPABASE_ANON_KEY}`,
      '-e',
      `PERF_P95_MS=${process.env.PERF_P95_MS ?? '2000'}`,
      '-v',
      `${volume}:/tests`,
      '-w',
      '/tests',
      'grafana/k6',
      'run',
      '--summary-export',
      `/tests/${relSummary}`,
      'perf/k6/vocab-enrich-smoke.js',
    ],
    { stdio: 'inherit', env: process.env },
  );
  return r.status ?? 1;
}

function readK6Metrics(summaryPath: string): { p95Ms: number | null; errorRate: number | null } {
  try {
    const raw = JSON.parse(readFileSync(summaryPath, 'utf8')) as {
      metrics?: {
        http_req_duration?: { values?: Record<string, number> };
        http_req_failed?: { values?: { rate?: number } };
      };
    };
    const p95Ms = raw.metrics?.http_req_duration?.values?.['p(95)'] ?? null;
    const errorRate = raw.metrics?.http_req_failed?.values?.rate ?? null;
    return { p95Ms, errorRate };
  } catch {
    return { p95Ms: null, errorRate: null };
  }
}
