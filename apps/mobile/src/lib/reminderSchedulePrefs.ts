import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_REMINDER_WINDOW, type ReminderWindowPrefs } from '@hoc-cung-bee/features';

const KEY = '@cuder/reminder_window_prefs';

export async function loadReminderWindowPrefs(): Promise<ReminderWindowPrefs> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT_REMINDER_WINDOW;
    const parsed = JSON.parse(raw) as ReminderWindowPrefs;
    return {
      windowStartHour: clamp(parsed.windowStartHour, 8),
      windowEndHour: clamp(parsed.windowEndHour, 20),
      intervalHours: clamp(parsed.intervalHours, 3),
    };
  } catch {
    return DEFAULT_REMINDER_WINDOW;
  }
}

export async function saveReminderWindowPrefs(prefs: ReminderWindowPrefs): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(prefs));
}

function clamp(n: unknown, fallback: number): number {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}
