import { execSync, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const testsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

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

  if (!isK6Installed()) {
    return { exitCode: 0, summaryPath, p95Ms: null, errorRate: null, skipped: true, reason: 'k6 CLI chưa cài' };
  }

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

  try {
    execSync(`k6 run --summary-export "${summaryPath}" "${scriptPath}"`, {
      stdio: 'inherit',
      cwd: testsRoot,
      env: process.env,
      shell: true,
    });
  } catch (e) {
    const code = typeof e === 'object' && e && 'status' in e ? Number((e as { status: number }).status) : 1;
    const metrics = readK6Metrics(summaryPath);
    return { exitCode: code, summaryPath, ...metrics, skipped: false };
  }

  const metrics = readK6Metrics(summaryPath);
  writeFileSync(
    join(reportsDir, 'latest-run.json'),
    JSON.stringify({ script: scriptRelativePath, ...metrics, at: new Date().toISOString() }, null, 2),
  );
  return { exitCode: 0, summaryPath, ...metrics, skipped: false };
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
