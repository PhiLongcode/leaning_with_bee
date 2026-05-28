/**
 * Copy .env.development hoặc .env.production → .env (Expo đọc .env mặc định).
 * Usage: node scripts/use-env.js development|production
 */
const fs = require('fs');
const path = require('path');

const target = process.argv[2] ?? 'development';
const root = path.join(__dirname, '..');
const source = path.join(root, `.env.${target}`);
const dest = path.join(root, '.env');

if (!fs.existsSync(source)) {
  console.error(`Missing ${source} — copy from .env.${target}.example`);
  process.exit(1);
}

fs.copyFileSync(source, dest);
console.log(`Using ${path.basename(source)} → .env`);
