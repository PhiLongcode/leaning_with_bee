import { Pressable, StyleSheet, Text, View } from 'react-native';
import { brand } from '../theme/colors';

type Props = {
  title?: string;
  label?: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ title, label, onPress, disabled }: Props) {
  const text = label ?? title ?? '';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.wrap, pressed && !disabled && styles.pressed, disabled && styles.disabled]}
    >
      <View style={styles.btn}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  btn: {
    backgroundColor: brand.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderBottomWidth: 3,
    borderBottomColor: brand.primaryPressed,
    alignItems: 'center',
  },
  pressed: { opacity: 0.9, transform: [{ translateY: 1 }] },
  disabled: { opacity: 0.45 },
  text: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
});
