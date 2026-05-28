export const brand = {
  primary: '#58CC02',
  primaryPressed: '#46A302',
  accent: '#1CB0F6',
  error: '#FF4B4B',
  xp: '#FFC800',
} as const;

export const light = {
  background: { primary: '#F8FAF5', secondary: '#FFFFFF', elevated: '#FFFFFF' },
  text: { primary: '#1A1F16', secondary: '#5C6356', tertiary: '#8A9186' },
  border: { primary: '#D8DED0', tertiary: '#E8EDE3' },
  surface: {
    success: '#EAF3DE',
    successText: '#3B6D11',
    info: '#E6F1FB',
    infoText: '#185FA5',
    accent: '#FFF8E6',
    accentText: '#9A6B00',
  },
} as const;

export const dark = {
  background: { primary: '#121412', secondary: '#1C1F1A', elevated: '#252922' },
  text: { primary: '#F2F4EF', secondary: '#A8AEA3', tertiary: '#6E7568' },
  border: { primary: '#3A4034', tertiary: '#2E3329' },
  surface: {
    success: '#2D4A1A',
    successText: '#A8D080',
    info: '#1A3A5C',
    infoText: '#8BB8E8',
    accent: '#3D3520',
    accentText: '#FAC775',
  },
} as const;

export type ThemeColors = typeof light | typeof dark;
