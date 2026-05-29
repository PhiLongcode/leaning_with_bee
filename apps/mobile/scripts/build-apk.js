/**
 * Build Android APK (release, signed with debug keystore from prebuild).
 * Usage: node scripts/build-apk.js [development|production]
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ANDROID = path.join(ROOT, 'android');
const GRADLE_WRAPPER = path.join(ANDROID, 'gradle', 'wrapper', 'gradle-wrapper.properties');
const APK_OUT = path.join(
  ANDROID,
  'app',
  'build',
  'outputs',
  'apk',
  'release',
  'app-release.apk',
);
const DIST = path.join(ROOT, 'dist');

const envName = process.argv[2] === 'production' ? 'production' : 'development';

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    cwd: opts.cwd ?? ROOT,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...opts.env },
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function patchGradleWrapper() {
  if (!fs.existsSync(GRADLE_WRAPPER)) return;
  let text = fs.readFileSync(GRADLE_WRAPPER, 'utf8');
  if (text.includes('gradle-9.')) {
    text = text.replace(
      /gradle-9\.[\d.]+-bin\.zip/,
      'gradle-8.13-bin.zip',
    );
    fs.writeFileSync(GRADLE_WRAPPER, text);
    console.log('[build-apk] Gradle wrapper → 8.13 (tránh lỗi foojay trên Gradle 9)');
  }
}

function patchGradleProperties() {
  const propsPath = path.join(ANDROID, 'gradle.properties');
  if (!fs.existsSync(propsPath)) return;
  let text = fs.readFileSync(propsPath, 'utf8');
  const entries = [
    ['org.gradle.jvm.toolchain.foojay-resolver.enabled=false', 'Tắt foojay toolchain resolver'],
    ['android.ndkVersion=28.2.13676358', 'NDK 28.2 (tránh NDK 27.1 hỏng'],
  ];
  for (const [line, label] of entries) {
    if (!text.includes(line.split('=')[0])) {
      text += `\n${line}\n`;
      console.log(`[build-apk] ${label}`);
    }
  }
  fs.writeFileSync(propsPath, text);
}

function patchRootBuildGradle() {
  const rootGradle = path.join(ANDROID, 'build.gradle');
  if (!fs.existsSync(rootGradle)) return;
  let text = fs.readFileSync(rootGradle, 'utf8');
  if (text.includes('beeNdk')) return;
  const patch = `

def beeNdk = findProperty("android.ndkVersion") ?: "28.2.13676358"
ext.ndkVersion = beeNdk

apply plugin: "expo-root-project"
apply plugin: "com.facebook.react.rootproject"
`;
  if (text.includes('apply plugin: "expo-root-project"')) {
    text = text.replace(
      /apply plugin: "expo-root-project"\s*\napply plugin: "com\.facebook\.react\.rootproject"/,
      patch.trim(),
    );
    fs.writeFileSync(rootGradle, text);
    console.log('[build-apk] Override NDK trước expo-root-project');
    return;
  }
  fs.appendFileSync(rootGradle, patch);
  console.log('[build-apk] Override NDK cho mọi module Android');
}

function patchAppBuildGradle() {
  const appGradle = path.join(ANDROID, 'app', 'build.gradle');
  if (!fs.existsSync(appGradle)) return;
  let text = fs.readFileSync(appGradle, 'utf8');
  const want =
    "ndkVersion findProperty('android.ndkVersion') ?: rootProject.ext.ndkVersion";
  if (text.includes('ndkVersion rootProject.ext.ndkVersion') && !text.includes('findProperty')) {
    text = text.replace(
      'ndkVersion rootProject.ext.ndkVersion',
      want,
    );
    fs.writeFileSync(appGradle, text);
    console.log('[build-apk] Cho phép override NDK qua gradle.properties');
  }
}

function removeBrokenNdk27() {
  const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (!sdk) return;
  const broken = path.join(sdk, 'ndk', '27.1.12297006');
  const marker = path.join(broken, 'source.properties');
  if (fs.existsSync(broken) && !fs.existsSync(marker)) {
    fs.rmSync(broken, { recursive: true, force: true });
    console.log('[build-apk] Đã xóa NDK 27.1 hỏng (thiếu source.properties)');
  }
}

console.log(`[build-apk] Env: ${envName}`);
removeBrokenNdk27();
run('node', ['scripts/use-env.js', envName]);

if (!fs.existsSync(ANDROID)) {
  console.log('[build-apk] expo prebuild --platform android');
  run('npx', ['expo', 'prebuild', '--platform', 'android', '--no-install']);
}

patchGradleWrapper();
patchGradleProperties();
patchRootBuildGradle();
patchAppBuildGradle();

console.log('[build-apk] Gradle assembleRelease…');
const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
run(gradlew, ['assembleRelease'], {
  cwd: ANDROID,
  env: { NODE_ENV: 'production' },
});

if (!fs.existsSync(APK_OUT)) {
  console.error('[build-apk] Không thấy APK:', APK_OUT);
  process.exit(1);
}

fs.mkdirSync(DIST, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
const dest = path.join(DIST, `hoc-cung-bee-${envName}-${stamp}.apk`);
fs.copyFileSync(APK_OUT, dest);

console.log('\n[build-apk] Xong.');
console.log('  APK:', dest);
console.log('  Cài máy: adb install -r "' + dest + '"');
