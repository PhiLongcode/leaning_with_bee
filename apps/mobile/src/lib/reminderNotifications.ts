import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  buildReminderMessage,
  getDueReviews,
  mergeSettingsWithAnchor,
  type NotificationSettings,
  type ReminderWindowPrefs,
} from '@hoc-cung-bee/features';
import { getLearningProgressRepository } from './featureRepos';

export const REMINDER_NOTIFICATION_PREFIX = 'cuder-reminder-';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensureNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function getNotificationPermissionStatus(): Promise<string> {
  if (Platform.OS === 'web') return 'unsupported';
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

async function resolveDueMessage(deviceId: string) {
  const due = await getDueReviews(getLearningProgressRepository(), deviceId);
  const count = due.ok ? due.value.length : 0;
  const sample = due.ok ? due.value[0]?.vocabulary?.word : undefined;
  return buildReminderMessage(count, sample);
}

export async function cancelAllReminderNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if (n.identifier.startsWith(REMINDER_NOTIFICATION_PREFIX)) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
}

export async function syncReminderNotifications(
  deviceId: string,
  settings: NotificationSettings,
  windowPrefs: ReminderWindowPrefs,
): Promise<{ scheduled: number; permission: string }> {
  if (Platform.OS === 'web') {
    return { scheduled: 0, permission: 'unsupported' };
  }

  await cancelAllReminderNotifications();

  if (!settings.enabled) {
    return { scheduled: 0, permission: await getNotificationPermissionStatus() };
  }

  const granted = await ensureNotificationPermissions();
  if (!granted) {
    return { scheduled: 0, permission: 'denied' };
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('learning-reminders', {
      name: 'Nhắc học',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }

  const message = await resolveDueMessage(deviceId);
  const slots = mergeSettingsWithAnchor(settings, windowPrefs);

  for (const slot of slots) {
    const id = `${REMINDER_NOTIFICATION_PREFIX}${slot.hour}-${slot.minute}`;
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: message.title,
        body: message.body,
        data: { screen: 'fn05_spaced_repetition' },
        ...(Platform.OS === 'android' ? { channelId: 'learning-reminders' } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: slot.hour,
        minute: slot.minute,
      },
    });
  }

  return { scheduled: slots.length, permission: 'granted' };
}

/** Nhắc thử ngay (kiểm tra quyền + nội dung). */
export async function sendTestReminderNotification(deviceId: string): Promise<void> {
  if (Platform.OS === 'web') return;
  const granted = await ensureNotificationPermissions();
  if (!granted) return;
  const message = await resolveDueMessage(deviceId);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `[Thử] ${message.title}`,
      body: message.body,
      data: { screen: 'fn05_spaced_repetition' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
    },
  });
}
