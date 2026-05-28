import type { NotificationSettings } from '../domain/notification';
import type { NotificationRepository } from '../infrastructure/notificationRepository';
import type { Result } from '../../shared/result';

export function getNotificationSettings(
  repo: NotificationRepository,
  deviceId: string,
): Promise<Result<NotificationSettings>> {
  return repo.getSettings(deviceId);
}

export function saveNotificationSettings(
  repo: NotificationRepository,
  settings: NotificationSettings,
): Promise<Result<NotificationSettings>> {
  if (settings.reminderHour < 0 || settings.reminderHour > 23) {
    return Promise.resolve({ ok: false, error: 'Giờ nhắc không hợp lệ.' });
  }
  return repo.saveSettings(settings);
}
