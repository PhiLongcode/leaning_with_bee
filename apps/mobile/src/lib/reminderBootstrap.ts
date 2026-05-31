import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getNotificationSettings } from '@hoc-cung-bee/features';
import type { Screen } from '../navigation/screens';
import { getNotificationRepository } from './featureRepos';
import { syncReminderNotifications } from './reminderNotifications';
import { loadReminderWindowPrefs } from './reminderSchedulePrefs';

/** Khôi phục lịch nhắc sau khi mở app (deviceId đã có). */
export async function bootstrapReminderNotifications(deviceId: string): Promise<void> {
  if (Platform.OS === 'web') return;
  const settingsResult = await getNotificationSettings(getNotificationRepository(), deviceId);
  if (!settingsResult.ok) return;
  const prefs = await loadReminderWindowPrefs();
  await syncReminderNotifications(deviceId, settingsResult.value, prefs);
}

/** REQ-11: mở app từ notification → màn ôn SRS. */
export function attachNotificationOpenHandler(setScreen: (screen: Screen) => void): () => void {
  if (Platform.OS === 'web') return () => {};

  const sub = Notifications.addNotificationResponseReceivedListener((response) => {
    const screen = response.notification.request.content.data?.screen;
    if (screen === 'fn05_spaced_repetition') {
      setScreen('fn05_spaced_repetition');
    }
  });

  return () => sub.remove();
}
