const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

// `dist/` is static export + `web:serve` — exclude from Metro watcher (EPERM when serve locks files)
const distPath = path.resolve(projectRoot, 'dist');
config.resolver = config.resolver ?? {};
config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList) ? config.resolver.blockList : []),
  new RegExp(`${distPath.replace(/[/\\]/g, '[/\\\\]')}[/\\\\].*`),
];

const emptyShim = path.resolve(projectRoot, 'shims/empty.js');
const nodeBuiltins = new Set([
  'stream',
  'crypto',
  'http',
  'https',
  'net',
  'tls',
  'zlib',
  'url',
  'util',
  'events',
  'ws',
  'buffer',
  'string_decoder',
  'querystring',
]);

const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (nodeBuiltins.has(moduleName)) {
    return { type: 'sourceFile', filePath: emptyShim };
  }
  if (defaultResolve) {
    return defaultResolve(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
