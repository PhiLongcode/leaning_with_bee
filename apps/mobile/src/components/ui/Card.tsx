import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outline';
};

export function Card({ children, onPress, style, variant = 'elevated' }: Props) {
  const { colors, tokens, isDark } = useTheme();

  const bg =
    variant === 'outline'
      ? 'transparent'
      : variant === 'elevated'
        ? colors.background.elevated
        : colors.background.secondary;

  const baseStyle = [
    styles.card,
    {
      backgroundColor: bg,
      borderColor: colors.border.tertiary,
      borderWidth: variant === 'outline' ? 1 : 0,
    },
    variant === 'elevated' && !isDark && tokens.shadow.card,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [baseStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={baseStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});
