/**
 * Chạy toàn bộ BDD (domain + UI) và mở trang tổng hợp báo cáo.
 * Serenity BDD dashboard (Java) cần JSON trong target/site/serenity — xem test:bdd:report.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const testsDir = join(__dirname, '..');
const reportsDir = join(testsDir, 'reports');
const stamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

function run(label, args, cwd = testsDir) {
  console.log(`\n> ${label}\n`);
  const r = spawnSync('npm', args, { cwd, shell: true, stdio: 'inherit' });
  return r.status ?? 1;
}

mkdirSync(reportsDir, { recursive: true });

let failed = false;
if (run('BDD domain (fn01, fn02, fn17)', ['run', 'test']) !== 0) failed = true;

const indexHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <title>Học cùng Bee — Báo cáo test BDD</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; max-width: 52rem; line-height: 1.5; }
    h1 { color: #1e8449; }
    a { color: #1565c0; }
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem 1.25rem; margin: 1rem 0; }
    code { background: #f4f4f4; padding: 0.15rem 0.35rem; border-radius: 4px; }
    ul { padding-left: 1.25rem; }
  </style>
</head>
<body>
  <h1>Báo cáo test — Học cùng Bee</h1>
  <p>Cập nhật: <strong>${stamp}</strong></p>
  <div class="card">
    <h2>Cucumber (scenario chi tiết)</h2>
    <p>Mở file HTML do Cucumber sinh sau mỗi lần chạy BDD:</p>
    <p><a href="cucumber-report.html">cucumber-report.html</a> — domain 12 scenario (fn01, fn02, fn17)</p>
    <p>Để gồm UI + perf: <code>npm run test:all</code> trong thư mục <code>tests/</code> (ghi đè file trên).</p>
  </div>
  <div class="card">
    <h2>Serenity BDD dashboard (donut chart)</h2>
    <p>Chưa có <code>reports/serenity/index.html</code> cho đến khi JSON được lưu vào <code>tests/target/site/serenity</code>.</p>
    <p>Thử (cần Java): <code>npm run test:bdd:report</code> từ repo root.</p>
    <p><em>Không</em> dùng file demo «Release: Iteration-1 / frequent flyer» — không thuộc dự án này.</p>
  </div>
  <div class="card">
    <h2>Ma trận FN (SSOT)</h2>
    <p><a href="../../process/00_global_test_report.md">process/00_global_test_report.md</a></p>
  </div>
  <div class="card">
    <h2>Lệnh tái tạo (repo root)</h2>
    <ul>
      <li><code>npm run test:verify</code> — unit + BDD domain</li>
      <li><code>npm run test:bdd:fn01:ui</code> — UI Playwright (3 scenario)</li>
      <li><code>npm run test:bdd:report</code> — BDD + Serenity aggregate (nếu Java + JSON OK)</li>
      <li><code>npm run test:report:full</code> — unit + BDD + refresh script</li>
    </ul>
  </div>
</body>
</html>
`;

writeFileSync(join(reportsDir, 'index.html'), indexHtml, 'utf8');
console.log(`\nWrote ${join(reportsDir, 'index.html')}`);
process.exit(failed ? 1 : 0);
