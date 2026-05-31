/** SSOT: docs/02_system_design/sys_design_ux_ui.md §2–3 */

export const brand = {
  primary: '#27AE60',
  primaryDark: '#1B8E3D',
  primaryLight: '#E8F5E9',
  primaryText: '#1A8D44',
  primaryPressed: '#1B8E3D',
  blue: '#0085E5',
  orange: '#FF9F43',
  error: '#FF4B4B',
  xp: '#FFC800',
  mintButton: '#E9F7EF',
} as const;

export const surface = {
  page: '#F8F9FA',
  pageAlt: '#F0F4F8',
  pageCool: '#F5F7F9',
  card: '#FFFFFF',
  progressTrack: '#D5F5E3',
} as const;

/** App-wide dark (Settings → Tối) — not FN-07 darkAi */
export const surfaceDark = {
  page: '#1A1A1A',
  pageAlt: '#1E1E1E',
  pageCool: '#222222',
  card: '#2A2A2A',
  progressTrack: '#2D4A1A',
} as const;

export const darkAi = {
  background: '#0B0E14',
  surface: '#1A2421',
  accent: '#2ECC71',
  text: '#F5F5F5',
  textMuted: '#A0A0A0',
} as const;

export const light = {
  background: { primary: surface.page, secondary: '#F5F5F5', elevated: surface.card },
  text: {
    primary: '#000000',
    secondary: '#4A4A4A',
    tertiary: '#757575',
    inactive: '#9E9E9E',
    onPrimary: '#FFFFFF',
  },
  border: { primary: '#D4D4D4', tertiary: '#E8E8E8' },
  surface: {
    success: '#EAF3DE',
    successText: '#3B6D11',
    info: '#E6F1FB',
    infoText: '#185FA5',
    accent: '#FAEEDA',
    accentText: '#854F0B',
  },
} as const;

export const dark = {
  background: { primary: '#1A1A1A', secondary: '#2A2A2A', elevated: '#2A2A2A' },
  text: {
    primary: '#F5F5F5',
    secondary: '#A0A0A0',
    tertiary: '#6B6B6B',
    inactive: '#6B6B6B',
    onPrimary: '#FFFFFF',
  },
  border: { primary: '#404040', tertiary: '#333333' },
  surface: {
    success: '#2D4A1A',
    successText: '#A8D080',
    info: '#1A3A5C',
    infoText: '#8BB8E8',
    accent: '#4A3A15',
    accentText: '#FAC775',
  },
} as const;

export type ThemeColors = typeof light | typeof dark;
