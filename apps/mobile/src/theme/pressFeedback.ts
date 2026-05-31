import { Platform, type ViewStyle } from 'react-native';

/** SSOT hiệu ứng nhấn — docs/02_system_design/sys_design_ux_ui.md §5.1 */
export const PRESS = {
  opacity: { default: 0.85, subtle: 0.92, icon: 0.55 },
  scale: { card: 0.98, button: 0.99, tab: 0.92, chip: 0.96, icon: 0.88 },
  translateY: { button: 2 },
} as const;

export function pressOpacity(pressed: boolean, disabled?: boolean, subtle = false): ViewStyle {
  if (disabled) return { opacity: 0.45 };
  if (!pressed) return {};
  return { opacity: subtle ? PRESS.opacity.subtle : PRESS.opacity.default };
}

export function pressButton(pressed: boolean, disabled?: boolean): ViewStyle {
  if (disabled) return { opacity: 0.45 };
  if (!pressed) return {};
  return {
    opacity: PRESS.opacity.subtle,
    transform: [{ translateY: PRESS.translateY.button }, { scale: PRESS.scale.button }],
  };
}

export function pressCard(pressed: boolean, disabled?: boolean): ViewStyle {
  if (disabled) return { opacity: 0.5 };
  if (!pressed) return {};
  return { opacity: PRESS.opacity.subtle, transform: [{ scale: PRESS.scale.card }] };
}

export function pressChip(pressed: boolean, disabled?: boolean): ViewStyle {
  if (disabled) return { opacity: 0.5 };
  if (!pressed) return {};
  return { opacity: PRESS.opacity.default, transform: [{ scale: PRESS.scale.chip }] };
}

export function pressTab(pressed: boolean, disabled?: boolean): ViewStyle {
  if (disabled) return {};
  if (!pressed) return {};
  return { opacity: PRESS.opacity.default, transform: [{ scale: PRESS.scale.tab }] };
}

export function pressIcon(pressed: boolean, disabled?: boolean): ViewStyle {
  if (disabled) return { opacity: 0.4 };
  if (!pressed) return {};
  return { opacity: PRESS.opacity.icon, transform: [{ scale: PRESS.scale.icon }] };
}

export function androidRipple(color: string, borderless = false) {
  return Platform.OS === 'android' ? { color, borderless } : undefined;
}
