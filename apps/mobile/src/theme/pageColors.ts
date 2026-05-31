import type { Screen } from '../navigation/screens';
import { darkAi, surface } from './colors';

/** Nền trang theo light/dark — SSOT sys_design_ux_ui.md §2 */
export type PageColors = {
  background: string;
  alt: string;
  sheet: string;
  /** Bottom nav luôn sáng (§4.4.5) */
  nav: string;
};

export function resolvePageColors(isDark: boolean): PageColors {
  if (isDark) {
    return {
      background: '#1A1A1A',
      alt: '#222628',
      sheet: '#2A2E2C',
      nav: surface.card,
    };
  }
  return {
    background: surface.page,
    alt: surface.pageAlt,
    sheet: surface.card,
    nav: surface.card,
  };
}

/** Nền root SafeAreaView — Gia sư AI luôn dark space theme dù app light/dark */
export function resolveRootBackground(screen: Screen, isDark: boolean, pageBg: string): string {
  if (screen === 'fn07_ai_chat') return darkAi.background;
  return pageBg;
}

export function isAiTutorScreen(screen: Screen): boolean {
  return screen === 'fn07_ai_chat';
}
