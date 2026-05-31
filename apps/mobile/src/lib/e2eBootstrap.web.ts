import type { Screen } from '../navigation/screens';
import { useAppStore } from '../store/appStore';

const E2E_SCREENS = new Set<string>([
  'splash',
  'home',
  'settings',
  'fn01_vocabulary',
  'fn02_vocab_manage',
  'fn03_sentences',
  'fn04_collection',
  'fn05_spaced_repetition',
  'fn06_context_review',
  'fn07_ai_chat',
  'fn08_speaking',
  'fn09_pronunciation',
  'fn10_dashboard',
  'fn11_notifications',
]);

/** Web-only: ?e2e=1&screen=fn01_vocabulary — nhảy thẳng màn cho UI automation. */
export function applyE2eBootstrapWeb(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (params.get('e2e') !== '1') return;

  const screen = params.get('screen');
  const next: Screen =
    screen && E2E_SCREENS.has(screen) ? (screen as Screen) : 'home';
  useAppStore.getState().setScreen(next);
}
