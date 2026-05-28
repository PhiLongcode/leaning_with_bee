import Constants from 'expo-constants';

type VersionExtra = {
  appVersion?: string;
  iosBuildNumber?: string;
  androidVersionCode?: number;
};

const extra = (Constants.expoConfig?.extra ?? {}) as VersionExtra;

/** Semver — đồng bộ `apps/mobile/version.json` */
export const appVersion = extra.appVersion ?? Constants.expoConfig?.version ?? '0.0.0';

export const iosBuildNumber = extra.iosBuildNumber ?? '1';
export const androidVersionCode = extra.androidVersionCode ?? 1;

/** Chuỗi hiển thị: v1.0.0 (build 1) */
export const appVersionLabel = `v${appVersion} (build ${iosBuildNumber})`;
