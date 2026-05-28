import type { ComponentProps } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';

type Fa6Name = ComponentProps<typeof FontAwesome6>['name'];

/** Semantic names → Font Awesome 6 Solid (classic solid on fontawesome.com) */
export const APP_ICONS = {
  user: 'user',
  settings: 'gear',
  streak: 'fire',
  xp: 'star',
  vocabulary: 'book-open',
  review: 'bullseye',
  speaking: 'microphone',
  aiChat: 'robot',
  collection: 'book',
  progress: 'chart-line',
  workplace: 'building',
  developer: 'laptop-code',
  link: 'link',
  module: 'box',
  sparkle: 'wand-magic-sparkles',
  construction: 'hammer',
  volume: 'volume-high',
  chevronRight: 'chevron-right',
  arrowLeft: 'arrow-left',
  sun: 'sun',
  moon: 'moon',
  system: 'mobile-screen',
  database: 'database',
  play: 'circle-play',
} as const satisfies Record<string, Fa6Name>;

export type AppIconName = keyof typeof APP_ICONS;

/** Quick-link labels on Home → icon */
export const QUICK_LINK_ICON: Record<string, AppIconName> = {
  'Từ vựng ngữ cảnh': 'vocabulary',
  'Context Review': 'review',
  Speaking: 'speaking',
  'AI Chat': 'aiChat',
  'Bộ sưu tập': 'collection',
  'Tiến độ': 'progress',
};
