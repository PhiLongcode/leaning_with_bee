import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const testsDir = join(__dirname, '..');
const mobileDir = join(testsDir, '..', 'apps', 'mobile');
const PORT = 8081;
const BASE = `http://localhost:${PORT}`;

const CONFIG_SUITES = {
  fn01: 'cucumber.fn01-ui.js',
  all: 'cucumber.ui.js',
};

function resolveConfig(argv) {
  const suiteIdx = argv.indexOf('--suite');
  if (suiteIdx >= 0 && argv[suiteIdx + 1]) {
    const key = argv[suiteIdx + 1];
    if (CONFIG_SUITES[key]) return CONFIG_SUITES[key];
  }
  return CONFIG_SUITES.all;
}

async function waitForServer(maxMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(BASE, { method: 'HEAD' });
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Web server not ready at ${BASE}`);
}

function runCucumber(configFile, cwd) {
  return new Promise((resolve) => {
    const child = spawn(
      'npx',
      ['tsx', './node_modules/@cucumber/cucumber/bin/cucumber.js', '--config', configFile],
      { cwd, shell: true, stdio: 'inherit' },
    );
    child.on('close', (code) => resolve(code ?? 1));
  });
}

const configFile = resolveConfig(process.argv.slice(2));

await new Promise((resolve) => {
  const stop = spawn('npm', ['run', 'web:serve:stop'], {
    cwd: mobileDir,
    shell: true,
    stdio: 'ignore',
  });
  stop.on('close', () => resolve());
  setTimeout(resolve, 1500);
});

const serve = spawn('npm', ['run', 'web:serve'], {
  cwd: mobileDir,
  shell: true,
  stdio: 'inherit',
});

let exitCode = 1;
try {
  await waitForServer();
  exitCode = await runCucumber(configFile, testsDir);
} finally {
  serve.kill('SIGTERM');
}

process.exit(exitCode);
