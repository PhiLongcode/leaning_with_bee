import { ok, type Result } from '../../shared/result';
import { isMissingTableError } from '../../shared/supabaseErrors';
import { fromTable, type SupabaseLikeClient } from '../../shared/supabaseClient';
import type { NotificationSettings } from '../domain/notification';

export type NotificationRepository = {
  getSettings(deviceId: string): Promise<Result<NotificationSettings>>;
  saveSettings(settings: NotificationSettings): Promise<Result<NotificationSettings>>;
};

const defaults = (deviceId: string): NotificationSettings => ({
  deviceId,
  enabled: true,
  reminderHour: 9,
  reminderMinute: 0,
  windowStartHour: 8,
  windowEndHour: 20,
  intervalHours: 3,
});

const mockStore = new Map<string, NotificationSettings>();

export function createMockNotificationRepository(): NotificationRepository {
  return {
    async getSettings(deviceId) {
      return ok(mockStore.get(deviceId) ?? defaults(deviceId));
    },
    async saveSettings(settings) {
      mockStore.set(settings.deviceId, settings);
      return ok(settings);
    },
  };
}

export function createSupabaseNotificationRepository(
  client: SupabaseLikeClient,
): NotificationRepository {
  const mock = createMockNotificationRepository();
  let remoteUnavailable = false;

  return {
    async getSettings(deviceId) {
      if (remoteUnavailable) return mock.getSettings(deviceId);
      const { data, error } = await fromTable(client, 'notification_settings')
        .select(
          'device_id, enabled, reminder_hour, reminder_minute, window_start_hour, window_end_hour, interval_hours',
        )
        .eq('device_id', deviceId)
        .maybeSingle();
      if (error && isMissingTableError(error)) {
        remoteUnavailable = true;
        return mock.getSettings(deviceId);
      }
      if (error || !data) return mock.getSettings(deviceId);
      const row = data as Record<string, unknown>;
      return ok({
        deviceId: String(row.device_id),
        enabled: Boolean(row.enabled),
        reminderHour: Number(row.reminder_hour),
        reminderMinute: Number(row.reminder_minute),
        windowStartHour: Number(row.window_start_hour ?? 8),
        windowEndHour: Number(row.window_end_hour ?? 20),
        intervalHours: Number(row.interval_hours ?? 3),
      });
    },
    async saveSettings(settings) {
      if (remoteUnavailable) return mock.saveSettings(settings);
      const { error } = await fromTable(client, 'notification_settings')
        .upsert({
          device_id: settings.deviceId,
          enabled: settings.enabled,
          reminder_hour: settings.reminderHour,
          reminder_minute: settings.reminderMinute,
          window_start_hour: settings.windowStartHour,
          window_end_hour: settings.windowEndHour,
          interval_hours: settings.intervalHours,
        })
        .select('device_id')
        .single();
      if (error && isMissingTableError(error)) {
        remoteUnavailable = true;
        return mock.saveSettings(settings);
      }
      if (error) return mock.saveSettings(settings);
      return ok(settings);
    },
  };
}
