import type { TextStyle } from 'react-native';
import { FONT_FAMILY } from './fonts';
import { typography as typographyScale } from './tokens';

function withFamily(base: TextStyle, fontFamily: string): TextStyle {
  return { ...base, fontFamily, fontWeight: undefined };
}

/** Typography: Be Vietnam Pro (tiêu đề) + Nunito (nội dung) */
export const typographyWithFonts = {
  display: withFamily(typographyScale.display, FONT_FAMILY.titleBold),
  heading1: withFamily(typographyScale.heading1, FONT_FAMILY.titleSemiBold),
  heading2: withFamily(typographyScale.heading2, FONT_FAMILY.titleSemiBold),
  heading3: withFamily(typographyScale.heading3, FONT_FAMILY.titleSemiBold),
  body: withFamily(typographyScale.body, FONT_FAMILY.content),
  bodyMedium: withFamily(typographyScale.bodyMedium, FONT_FAMILY.contentMedium),
  caption: withFamily(typographyScale.caption, FONT_FAMILY.content),
  captionBold: withFamily(typographyScale.captionBold, FONT_FAMILY.contentSemiBold),
  label: withFamily(typographyScale.label, FONT_FAMILY.contentMedium),
  button: withFamily(typographyScale.button, FONT_FAMILY.titleBold),
  h1: withFamily(typographyScale.h1, FONT_FAMILY.titleBold),
  h2: withFamily(typographyScale.h2, FONT_FAMILY.titleSemiBold),
  h3: withFamily(typographyScale.h3, FONT_FAMILY.titleSemiBold),
} as const;

/** TextInput & ô nhập — Nunito (nội dung) */
export const textInputStyle: TextStyle = {
  fontFamily: FONT_FAMILY.content,
  fontSize: 15,
  lineHeight: 22,
};

export type TypographyTokens = typeof typographyWithFonts;
