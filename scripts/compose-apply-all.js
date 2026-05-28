/**
 * Gộp supabase/migrations/*.sql → supabase/apply-all.sql (chạy trước db:sync hoặc thủ công).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MIGRATIONS = path.join(ROOT, 'supabase', 'migrations');
const OUT = path.join(ROOT, 'supabase', 'apply-all.sql');

const header = `-- Tự động gộp từ supabase/migrations/ — ${new Date().toISOString().slice(0, 10)}
-- Chạy: npm run db:sync
-- Hoặc Supabase Dashboard → SQL Editor
-- Policies: DROP IF EXISTS trước CREATE (chạy lại an toàn khi schema đã có một phần)

`;

/** Thêm drop policy trước mỗi create policy nếu migration chưa có. */
function makePoliciesIdempotent(sql) {
  const lines = sql.split('\n');
  const out = [];
  for (const line of lines) {
    const m = line.match(/^(\s*)create\s+policy\s+(\w+)\s+on\s+([\w.]+)/i);
    if (m) {
      const [, indent, name, table] = m;
      const prev = out[out.length - 1] ?? '';
      if (!new RegExp(`drop\\s+policy\\s+if\\s+exists\\s+${name}\\b`, 'i').test(prev)) {
        out.push(`${indent}drop policy if exists ${name} on ${table};`);
      }
    }
    out.push(line);
  }
  return out.join('\n');
}

const files = fs.readdirSync(MIGRATIONS).filter((f) => f.endsWith('.sql')).sort();
const parts = files.map((f) => {
  const sql = makePoliciesIdempotent(fs.readFileSync(path.join(MIGRATIONS, f), 'utf8').trim());
  return `-- === ${f} ===\n\n${sql}`;
});

fs.writeFileSync(OUT, header + parts.join('\n\n') + '\n', 'utf8');
console.log(`Wrote ${OUT} (${files.length} migrations)`);
