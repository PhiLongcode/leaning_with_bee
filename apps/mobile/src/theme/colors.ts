export const brand = {
  primary: '#58CC02',
  primaryPressed: '#46A302',
  accent: '#1CB0F6',
  error: '#FF4B4B',
  xp: '#FFC800',
} as const;

export const light = {
  background: { primary: '#FFFFFF', secondary: '#F5F5F5' },
  text: { primary: '#1A1A1A', secondary: '#5C5C5C', tertiary: '#888780' },
  border: { primary: '#D4D4D4', tertiary: '#E8E8E8' },
  surface: { success: '#EAF3DE', successText: '#3B6D11' },
} as const;

export const dark = {
  background: { primary: '#1A1A1A', secondary: '#2A2A2A' },
  text: { primary: '#F5F5F5', secondary: '#A0A0A0', tertiary: '#6B6B6B' },
  border: { primary: '#404040', tertiary: '#333333' },
  surface: { success: '#2D4A1A', successText: '#A8D080' },
} as const;

export type ThemeColors = typeof light | typeof dark;
