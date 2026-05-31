import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AppIcon } from './AppIcon';

type Props = {
  label?: string;
  onPress?: () => void;
  compact?: boolean;
};

/** Solid orange CTA — no gradient (UX §4.4.1) */
export function UpgradeButton({ label = 'Nâng Cấp', onPress, compact }: Props) {
  const { brand, tokens } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.btn, compact && styles.compact, { backgroundColor: brand.orange }]}
    >
      <AppIcon name="xp" size={16} color="#FFFFFF" />
      <Text style={[tokens.typography.bodyMedium, styles.text]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    minHeight: 44,
  },
  compact: { paddingVertical: 8, paddingHorizontal: 12, minHeight: 40 },
  text: { color: '#FFFFFF', fontWeight: '600' },
});
