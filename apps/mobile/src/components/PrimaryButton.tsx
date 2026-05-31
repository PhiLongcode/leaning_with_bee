import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  title?: string;
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: Variant;
  style?: ViewStyle;
  compact?: boolean;
  testID?: string;
};

export function PrimaryButton({
  title,
  label,
  onPress,
  disabled,
  variant = 'primary',
  style,
  compact,
  testID,
}: Props) {
  const { brand, colors, tokens } = useTheme();
  const text = label ?? title ?? '';

  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.wrap,
        style,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View
        style={[
          styles.btn,
          compact && styles.btnCompact,
          isPrimary && {
            backgroundColor: brand.primary,
            borderBottomColor: brand.primaryPressed,
            borderBottomWidth: 3,
          },
          variant === 'secondary' && {
            backgroundColor: colors.background.secondary,
            borderWidth: 1,
            borderColor: colors.border.tertiary,
            borderBottomWidth: 1,
          },
          isGhost && { backgroundColor: 'transparent', borderBottomWidth: 0 },
        ]}
      >
        <Text
          style={[
            tokens.typography.button,
            isPrimary && styles.textPrimary,
            !isPrimary && { color: colors.text.primary },
          ]}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  btnCompact: { minHeight: 44, paddingVertical: 12 },
  pressed: { opacity: 0.92, transform: [{ translateY: 1 }] },
  disabled: { opacity: 0.45 },
  textPrimary: { color: '#FFFFFF' },
});
