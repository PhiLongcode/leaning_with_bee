import type { ExpoConfig } from 'expo/config';
import appJson from './app.json';
import versionInfo from './version.json';

const appEnv = process.env.EXPO_PUBLIC_APP_ENV === 'production' ? 'production' : 'development';
const appName = process.env.EXPO_PUBLIC_APP_NAME ?? appJson.expo.name;
const appVersion = process.env.EXPO_PUBLIC_APP_VERSION ?? versionInfo.version;

export default (): ExpoConfig => ({
  ...(appJson.expo as ExpoConfig),
  name: appName,
  version: appVersion,
  ios: {
    ...appJson.expo.ios,
    buildNumber: String(versionInfo.iosBuildNumber),
  },
  android: {
    ...appJson.expo.android,
    versionCode: versionInfo.androidVersionCode,
  },
  plugins: [
    [
      'expo-notifications',
      {
        icon: './assets/icon.png',
        color: '#5A8F29',
      },
    ],
  ],
  extra: {
    appEnv,
    appVersion,
    iosBuildNumber: String(versionInfo.iosBuildNumber),
    androidVersionCode: versionInfo.androidVersionCode,
  },
});
