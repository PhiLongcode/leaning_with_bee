import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { androidRipple, pressButton } from '../theme/pressFeedback';
import { useTheme } from '../theme/ThemeContext';

type Variant = 'primary' | 'blue' | 'secondary' | 'ghost';

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
  const isBlue = variant === 'blue';
  const isGhost = variant === 'ghost';
  const hasDepth = isPrimary || isBlue;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      android_ripple={androidRipple('rgba(255,255,255,0.22)')}
      style={({ pressed }) => [styles.wrap, style, pressButton(pressed, disabled)]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.btn,
            compact && styles.btnCompact,
            hasDepth && {
              backgroundColor: isBlue ? brand.blue : brand.primary,
              borderBottomColor: isBlue ? '#006BB8' : brand.primaryPressed,
              borderBottomWidth: pressed && !disabled ? 1 : 3,
            },
            variant === 'secondary' && {
              backgroundColor: colors.background.secondary,
              borderWidth: 1,
              borderColor: colors.border.tertiary,
              borderBottomWidth: 1,
            },
            isGhost && { backgroundColor: 'transparent', borderBottomWidth: 0 },
            pressed && !disabled && variant === 'secondary' && { backgroundColor: colors.background.secondary },
          ]}
        >
          <Text
            style={[
              tokens.typography.button,
              isPrimary && styles.textPrimary,
              isBlue && styles.textPrimary,
              !isPrimary && !isBlue && { color: colors.text.primary },
            ]}
          >
            {text}
          </Text>
        </View>
      )}
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
  textPrimary: { color: '#FFFFFF' },
});
