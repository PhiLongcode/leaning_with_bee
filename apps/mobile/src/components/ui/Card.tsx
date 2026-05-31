import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { AppPressable } from './AppPressable';
import { useTheme } from '../../theme/ThemeContext';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outline';
};

export function Card({ children, onPress, style, variant = 'elevated' }: Props) {
  const { colors, tokens, isDark, cardBg } = useTheme();

  const bg =
    variant === 'outline'
      ? 'transparent'
      : variant === 'elevated'
        ? cardBg
        : colors.background.secondary;

  const baseStyle = [
    styles.card,
    {
      backgroundColor: bg,
      borderColor: colors.border.tertiary,
      borderWidth: variant === 'outline' || isDark ? 1 : 0,
    },
    variant === 'elevated' && !isDark && tokens.shadow.card,
    style,
  ];

  if (onPress) {
    return (
      <AppPressable feedback="card" onPress={onPress} style={baseStyle}>
        {children}
      </AppPressable>
    );
  }

  return <View style={baseStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
  },
});
