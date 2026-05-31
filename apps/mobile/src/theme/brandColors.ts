import { brand as staticBrand } from './colors';

function clamp(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((c) => clamp(c).toString(16).padStart(2, '0')).join('')}`;
}

export function darkenHex(hex: string, amount = 0.12): string {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  const f = 1 - amount;
  return toHex(rgb.r * f, rgb.g * f, rgb.b * f);
}

export type RuntimeBrandColors = {
  primary: string;
  primaryPressed: string;
  accent: string;
  error: string;
  xp: string;
};

export function buildRuntimeBrand(primaryHex: string): RuntimeBrandColors {
  return {
    ...staticBrand,
    primary: primaryHex,
    primaryPressed: darkenHex(primaryHex),
  };
}
