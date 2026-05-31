/**
 * Chạy test và in tóm tắt (cập nhật cucumber-report.html qua tests/npm run test).
 * Usage: node scripts/refresh-test-report.js [--ui] [--perf]
 */
const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ARGS = process.argv.slice(2);

function run(cmd, args, cwd = ROOT) {
  console.log(`\n> ${cmd} ${args.join(' ')}\n`);
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: true });
  return r.status ?? 1;
}

let failed = false;

if (run('npm', ['run', 'test:unit']) !== 0) failed = true;

if (run('npm', ['run', 'test:domain:report'], path.join(ROOT, 'tests')) !== 0) failed = true;

if (ARGS.includes('--ui')) {
  if (run('npm', ['run', 'test:bdd:fn01:ui']) !== 0) failed = true;
}

if (ARGS.includes('--perf')) {
  if (run('npm', ['run', 'test:bdd:perf']) !== 0) failed = true;
}

console.log('\n[refresh-test-report] Báo cáo:');
console.log('  - process/00_global_test_report.md');
console.log('  - tests/reports/cucumber-report.html');
console.log('  - tests/reports/serenity/index.html (Serenity BDD dashboard)\n');

process.exit(failed ? 1 : 0);
