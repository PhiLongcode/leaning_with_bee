/** Khung giờ nhắc ngắt quãng (REQ-11) — lưu local hoặc mở rộng DB sau. */
export type ReminderWindowPrefs = {
  windowStartHour: number;
  windowEndHour: number;
  intervalHours: number;
};

export const DEFAULT_REMINDER_WINDOW: ReminderWindowPrefs = {
  windowStartHour: 8,
  windowEndHour: 20,
  intervalHours: 3,
};

export type ReminderSlot = {
  hour: number;
  minute: number;
};

export type ReminderMessage = {
  title: string;
  body: string;
};
