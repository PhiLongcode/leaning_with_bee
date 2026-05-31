/**
 * Bundled brand audio — SSOT file names: brand/AUDIO_MANIFEST.md
 * Regenerate: python scripts/generate-brand-audio.py
 */

export const BRAND_AUDIO_BUNDLED = true as const;

export const BRAND_SFX = {
  answerCorrect: require('../../assets/brand/audio/sfx/answer_correct.wav'),
  answerWrong: require('../../assets/brand/audio/sfx/answer_wrong.wav'),
  answerPartial: require('../../assets/brand/audio/sfx/answer_partial.wav'),
  xpGain: require('../../assets/brand/audio/sfx/xp_gain.wav'),
  streakTick: require('../../assets/brand/audio/sfx/streak_tick.wav'),
} as const;

export const BRAND_REMINDER = {
  default: require('../../assets/brand/audio/reminder/reminder_default.wav'),
  gentle: require('../../assets/brand/audio/reminder/reminder_gentle.wav'),
  urgent: require('../../assets/brand/audio/reminder/reminder_urgent.wav'),
} as const;

export const BRAND_PATHS = {
  logo: {
    mascot: 'brand/logo/cuder-mascot-hero.png',
    wordmarkLight: 'brand/logo/cuder-wordmark-light.png',
    wordmarkDark: 'brand/logo/cuder-wordmark-dark.png',
  },
  audio: {
    sfx: {
      answerCorrect: 'brand/audio/sfx/answer_correct.wav',
      answerWrong: 'brand/audio/sfx/answer_wrong.wav',
      answerPartial: 'brand/audio/sfx/answer_partial.wav',
      xpGain: 'brand/audio/sfx/xp_gain.wav',
      streakTick: 'brand/audio/sfx/streak_tick.wav',
    },
    reminder: {
      default: 'brand/audio/reminder/reminder_default.wav',
      gentle: 'brand/audio/reminder/reminder_gentle.wav',
      urgent: 'brand/audio/reminder/reminder_urgent.wav',
    },
  },
} as const;

export type StudySfxKey = keyof typeof BRAND_PATHS.audio.sfx;
export type ReminderSfxKey = keyof typeof BRAND_PATHS.audio.reminder;

export const APP_DISPLAY_NAME = 'Cuder Học Tiếng';
export const APP_TAGLINE = 'Học tiếng Anh mỗi ngày — cùng Cuder';
