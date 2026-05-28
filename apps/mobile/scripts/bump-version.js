/**
 * Tăng patch + build: node scripts/bump-version.js [patch|minor|major]
 * Sửa apps/mobile/version.json và package.json
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const versionPath = path.join(root, 'version.json');
const pkgPath = path.join(root, 'package.json');

const bump = process.argv[2] ?? 'patch';
const data = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
const parts = data.version.split('.').map(Number);

if (bump === 'major') {
  parts[0] += 1;
  parts[1] = 0;
  parts[2] = 0;
} else if (bump === 'minor') {
  parts[1] += 1;
  parts[2] = 0;
} else {
  parts[2] += 1;
}

data.version = parts.join('.');
data.iosBuildNumber = String(Number(data.iosBuildNumber) + 1);
data.androidVersionCode = Number(data.androidVersionCode) + 1;

fs.writeFileSync(versionPath, `${JSON.stringify(data, null, 2)}\n`);

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.version = data.version;
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

console.log(`Version → ${data.version} (iOS build ${data.iosBuildNumber}, Android ${data.androidVersionCode})`);
