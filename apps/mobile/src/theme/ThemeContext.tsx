import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DEFAULT_APP_BRAND_CONFIG } from '@hoc-cung-bee/features';
import { useBrandRuntime } from '../store/brandStore';
import {
  brand as staticBrand,
  dark,
  darkAi,
  light,
  surface,
  surfaceDark,
  type ThemeColors,
} from './colors';
import { buildRuntimeBrand, type RuntimeBrandColors } from './brandColors';
import { textInputStyle, typographyWithFonts } from './typographyStyles';
import { radius, shadow, spacing } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  colors: ThemeColors;
  brand: RuntimeBrandColors;
  /** Scroll/page background — switches with theme */
  pageBg: string;
  /** Part list, Settings — switches with theme */
  pageAltBg: string;
  /** Cards, elevated surfaces */
  cardBg: string;
  /** Bottom nav — always light per UX §4.4.5 */
  navBg: string;
  darkAi: typeof darkAi;
  tokens: {
    spacing: typeof spacing;
    radius: typeof radius;
    typography: typeof typographyWithFonts;
    shadow: typeof shadow;
    textInput: typeof textInputStyle;
  };
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('light');
  const brandRuntime = useBrandRuntime();

  const isDark = mode === 'dark' || (mode === 'system' && system === 'dark');
  const colors = isDark ? dark : light;
  const brand = useMemo(
    () => buildRuntimeBrand(brandRuntime.brandPrimaryHex ?? DEFAULT_APP_BRAND_CONFIG.brandPrimaryHex),
    [brandRuntime.brandPrimaryHex],
  );

  const pageBg = isDark ? surfaceDark.page : surface.page;
  const pageAltBg = isDark ? surfaceDark.pageAlt : surface.pageAlt;
  const cardBg = colors.background.elevated;
  const navBg = surface.card;

  const value = useMemo(
    () => ({
      colors,
      brand,
      pageBg,
      pageAltBg,
      cardBg,
      navBg,
      darkAi,
      tokens: { spacing, radius, typography: typographyWithFonts, shadow, textInput: textInputStyle },
      mode,
      setMode,
      isDark,
    }),
    [brand, cardBg, colors, isDark, mode, navBg, pageAltBg, pageBg],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
