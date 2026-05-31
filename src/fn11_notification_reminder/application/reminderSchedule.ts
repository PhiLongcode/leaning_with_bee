import type { NotificationSettings } from '../domain/notification';
import {
  DEFAULT_REMINDER_WINDOW,
  type ReminderMessage,
  type ReminderSlot,
  type ReminderWindowPrefs,
} from '../domain/reminderSchedule';

/** Các mốc giờ chia đều trong khung [start, end] theo interval (giờ). */
export function computeReminderSlots(
  prefs: ReminderWindowPrefs = DEFAULT_REMINDER_WINDOW,
  minute = 0,
): ReminderSlot[] {
  const start = clampHour(prefs.windowStartHour);
  const end = clampHour(prefs.windowEndHour);
  const interval = Math.max(1, Math.min(12, prefs.intervalHours));
  if (end < start) return [{ hour: start, minute }];

  const slots: ReminderSlot[] = [];
  for (let h = start; h <= end; h += interval) {
    slots.push({ hour: h, minute });
  }
  if (slots.length === 0 || slots[slots.length - 1].hour !== end) {
    const last = slots[slots.length - 1];
    if (!last || last.hour !== end) slots.push({ hour: end, minute });
  }
  return slots;
}

/** Nội dung ưu tiên FN-05 (từ đến hạn) rồi habit. */
export function buildReminderMessage(
  dueReviewCount: number,
  sampleWord?: string,
): ReminderMessage {
  if (dueReviewCount > 0) {
    const wordPart = sampleWord ? ` — ví dụ: «${sampleWord}»` : '';
    return {
      title: 'Cuder · Ôn từ đến hạn',
      body:
        dueReviewCount === 1
          ? `Bạn có 1 từ cần ôn hôm nay${wordPart}. Mở app để Spaced Repetition.`
          : `Bạn có ${dueReviewCount} từ cần ôn${wordPart}. Mở app để ôn ngay.`,
    };
  }
  return {
    title: 'Cuder · Nhắc học',
    body: 'Dành vài phút cho bài học hoặc Context Review — giữ streak nhé!',
  };
}

export function mergeSettingsWithAnchor(
  settings: NotificationSettings,
  prefs: ReminderWindowPrefs,
): ReminderSlot[] {
  const slots = computeReminderSlots(prefs, settings.reminderMinute);
  const anchor: ReminderSlot = {
    hour: settings.reminderHour,
    minute: settings.reminderMinute,
  };
  const hasAnchor = slots.some((s) => s.hour === anchor.hour && s.minute === anchor.minute);
  if (!hasAnchor) return [anchor, ...slots].sort((a, b) => a.hour - b.hour || a.minute - b.minute);
  return slots;
}

function clampHour(h: number): number {
  return Math.min(23, Math.max(0, Math.floor(h)));
}
