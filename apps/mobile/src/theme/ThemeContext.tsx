import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DEFAULT_APP_BRAND_CONFIG } from '@hoc-cung-bee/features';
import { useBrandRuntime } from '../store/brandStore';
import { brand as staticBrand, dark, light, type ThemeColors } from './colors';
import { buildRuntimeBrand, type RuntimeBrandColors } from './brandColors';
import { radius, shadow, spacing, typography } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  colors: ThemeColors;
  brand: RuntimeBrandColors;
  tokens: { spacing: typeof spacing; radius: typeof radius; typography: typeof typography; shadow: typeof shadow };
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

  const value = useMemo(
    () => ({
      colors,
      brand,
      tokens: { spacing, radius, typography, shadow },
      mode,
      setMode,
      isDark,
    }),
    [brand, colors, mode, isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
