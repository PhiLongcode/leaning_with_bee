import { describe, expect, it } from 'vitest';
import {
  buildReminderMessage,
  computeReminderSlots,
} from '../../src/fn11_notification_reminder/application/reminderSchedule';

describe('FN-11 reminder schedule', () => {
  it('computes slots every 3h from 8 to 20', () => {
    const slots = computeReminderSlots(
      { windowStartHour: 8, windowEndHour: 20, intervalHours: 3 },
      0,
    );
    expect(slots.map((s) => s.hour)).toEqual([8, 11, 14, 17, 20]);
  });

  it('prioritizes due review copy', () => {
    const msg = buildReminderMessage(3, 'deploy');
    expect(msg.title).toContain('Ôn');
    expect(msg.body).toContain('3 từ');
    expect(msg.body).toContain('deploy');
  });

  it('habit copy when no due', () => {
    const msg = buildReminderMessage(0);
    expect(msg.body).toContain('streak');
  });
});
