/**
 * Windows: `npx serve dist` (web:serve / UI tests) locks files under dist/.
 * Metro/Expo then fails with EPERM on lstat dist/index.html.
 * Stops node processes listening on WEB_SERVE_PORT that run `serve` on dist.
 */
const { execSync } = require('child_process');
const path = require('path');

const port = String(process.env.WEB_SERVE_PORT || '8081');
const distDir = path.join(__dirname, '..', 'dist').toLowerCase();

function pidsListeningOnPort(p) {
  if (process.platform !== 'win32') {
    return [];
  }
  try {
    const out = execSync(`netstat -ano | findstr :${p}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      if (!/LISTENING/i.test(line)) continue;
      const parts = line.trim().split(/\s+/);
      const pid = Number(parts[parts.length - 1]);
      if (pid > 0) pids.add(pid);
    }
    return [...pids];
  } catch {
    return [];
  }
}

function commandLine(pid) {
  if (process.platform !== 'win32') return '';
  try {
    const out = execSync(
      `powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}').CommandLine"`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] },
    );
    return (out || '').trim();
  } catch {
    return '';
  }
}

function isServeDist(cmd) {
  const c = cmd.toLowerCase();
  return c.includes('serve') && (c.includes('dist') || c.includes(distDir));
}

const pids = pidsListeningOnPort(port);
let stopped = 0;

for (const pid of pids) {
  const cmd = commandLine(pid);
  if (!isServeDist(cmd)) continue;
  try {
    execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
    stopped += 1;
    console.log(`[free-dist] Stopped serve on port ${port} (PID ${pid})`);
  } catch {
    console.warn(`[free-dist] Could not stop PID ${pid} — close the terminal running web:serve manually`);
  }
}

if (stopped === 0 && pids.length > 0) {
  console.log(`[free-dist] Port ${port} in use but not by serve dist — left unchanged`);
}
