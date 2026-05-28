import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

/** Kích thước mascot Bee (emoji thương hiệu — không dùng Font Awesome) */
const SIZES = {
  sm: 28,
  md: 36,
  lg: 52,
  hero: 56,
} as const;

type SizePreset = keyof typeof SIZES;

type Props = {
  /** Preset hoặc fontSize tùy chỉnh (px) */
  size?: SizePreset | number;
  style?: StyleProp<TextStyle>;
};

/**
 * Logo chú Bee — mascot 🐝 của app. Giữ emoji để đồng bộ wordmark / cảm giác thương hiệu.
 * Icon UI khác dùng {@link AppIcon} (Font Awesome).
 */
export function BeeLogo({ size = 'lg', style }: Props) {
  const fontSize = typeof size === 'number' ? size : SIZES[size];

  return (
    <Text style={[styles.bee, { fontSize, lineHeight: fontSize * 1.1 }, style]} accessibilityLabel="Bee mascot">
      🐝
    </Text>
  );
}

const styles = StyleSheet.create({
  bee: {
    textAlign: 'center',
    includeFontPadding: false,
  },
});
