import { Audio, type AVPlaybackSource } from 'expo-av';
import { BRAND_AUDIO_BUNDLED, BRAND_REMINDER, BRAND_SFX } from '../constants/brandAssets';

export type SoundSettings = {
  studySfxEnabled: boolean;
  reminderSfxEnabled: boolean;
};

let settings: SoundSettings = {
  studySfxEnabled: true,
  reminderSfxEnabled: true,
};

let audioModeReady = false;
let activeSound: Audio.Sound | null = null;

async function ensureAudioMode(): Promise<void> {
  if (audioModeReady) return;
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: false,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });
  audioModeReady = true;
}

async function stopActiveSound(): Promise<void> {
  if (!activeSound) return;
  try {
    await activeSound.stopAsync();
    await activeSound.unloadAsync();
  } catch {
    // ignore unload race
  }
  activeSound = null;
}

async function playSource(source: AVPlaybackSource): Promise<void> {
  if (!BRAND_AUDIO_BUNDLED) return;
  await ensureAudioMode();
  await stopActiveSound();
  const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true, volume: 1 });
  activeSound = sound;
  sound.setOnPlaybackStatusUpdate((status) => {
    if (!status.isLoaded || !status.didJustFinish) return;
    void sound.unloadAsync();
    if (activeSound === sound) activeSound = null;
  });
}

/** Cập nhật từ Cài đặt → Âm thanh */
export function setSoundSettings(next: Partial<SoundSettings>): void {
  settings = { ...settings, ...next };
}

export function getSoundSettings(): SoundSettings {
  return { ...settings };
}

export async function playAnswerCorrect(): Promise<void> {
  if (!settings.studySfxEnabled) return;
  await playSource(BRAND_SFX.answerCorrect);
}

export async function playAnswerWrong(): Promise<void> {
  if (!settings.studySfxEnabled) return;
  await playSource(BRAND_SFX.answerWrong);
}

export async function playAnswerPartial(): Promise<void> {
  if (!settings.studySfxEnabled) return;
  await playSource(BRAND_SFX.answerPartial);
}

export async function playXpGain(): Promise<void> {
  if (!settings.studySfxEnabled) return;
  await playSource(BRAND_SFX.xpGain);
}

export async function playStreakTick(): Promise<void> {
  if (!settings.studySfxEnabled) return;
  await playSource(BRAND_SFX.streakTick);
}

export async function playReminder(variant: 'default' | 'gentle' | 'urgent' = 'default'): Promise<void> {
  if (!settings.reminderSfxEnabled) return;
  const source =
    variant === 'gentle'
      ? BRAND_REMINDER.gentle
      : variant === 'urgent'
        ? BRAND_REMINDER.urgent
        : BRAND_REMINDER.default;
  await playSource(source);
}
