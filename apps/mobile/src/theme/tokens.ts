/** SSOT scale: docs/02_system_design/sys_design_ux_ui.md §3 — fontFamily: typographyStyles.ts */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 9999,
} as const;

export const typography = {
  display: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  heading1: { fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
  heading2: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  heading3: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  bodyMedium: { fontSize: 14, fontWeight: '500' as const, lineHeight: 21 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 17 },
  captionBold: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
  label: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.88, textTransform: 'uppercase' as const },
  button: { fontSize: 15, fontWeight: '700' as const, letterSpacing: 0.3 },
  /** @deprecated use heading1 */
  h1: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h2: { fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
  h3: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
} as const;
