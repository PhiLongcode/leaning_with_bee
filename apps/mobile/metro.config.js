const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

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
