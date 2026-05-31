import type { Screen } from './screens';

/** SSOT bottom nav: sys_design_ux_ui.md §4.2 */
export const MAIN_TAB_SCREENS: Screen[] = [
  'home',
  'fn07_ai_chat',
  'fn04_collection',
  'fn02_vocab_manage',
  'fn10_dashboard',
];

export type TabId = 'home' | 'tutor' | 'saved' | 'vocab' | 'account';

export const TAB_ITEMS: { id: TabId; label: string; screen: Screen; icon: 'home' | 'sparkle' | 'bookmark' | 'book' | 'user' }[] = [
  { id: 'home', label: 'Trang chủ', screen: 'home', icon: 'home' },
  { id: 'tutor', label: 'Gia sư AI', screen: 'fn07_ai_chat', icon: 'sparkle' },
  { id: 'saved', label: 'Đã lưu', screen: 'fn04_collection', icon: 'bookmark' },
  { id: 'vocab', label: 'Từ vựng', screen: 'fn02_vocab_manage', icon: 'book' },
  { id: 'account', label: 'Tài khoản', screen: 'fn10_dashboard', icon: 'user' },
];

export function showsBottomNav(screen: Screen): boolean {
  return MAIN_TAB_SCREENS.includes(screen);
}

export function tabIdForScreen(screen: Screen): TabId | null {
  const tab = TAB_ITEMS.find((t) => t.screen === screen);
  return tab?.id ?? null;
}
