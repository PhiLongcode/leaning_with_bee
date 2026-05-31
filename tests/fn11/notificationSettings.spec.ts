import { describe, expect, it } from 'vitest';
import {
  getNotificationSettings,
  saveNotificationSettings,
} from '../../src/fn11_notification_reminder/application/notificationUseCases';
import { createMockNotificationRepository } from '../../src/fn11_notification_reminder/infrastructure/notificationRepository';

describe('FN-11 notification settings', () => {
  const repo = createMockNotificationRepository();
  const deviceId = `fn11-settings-${Date.now()}`;

  it('returns default settings', async () => {
    const r = await getNotificationSettings(repo, deviceId);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.deviceId).toBe(deviceId);
  });

  it('saves valid reminder hour', async () => {
    const current = await getNotificationSettings(repo, deviceId);
    expect(current.ok).toBe(true);
    if (!current.ok) return;
    const next = { ...current.value, reminderHour: 9, enabled: true };
    const saved = await saveNotificationSettings(repo, next);
    expect(saved.ok && saved.value.reminderHour).toBe(9);
  });

  it('rejects invalid hour', async () => {
    const current = await getNotificationSettings(repo, deviceId);
    expect(current.ok).toBe(true);
    if (!current.ok) return;
    const r = await saveNotificationSettings(repo, { ...current.value, reminderHour: 25 });
    expect(r.ok).toBe(false);
  });
});
