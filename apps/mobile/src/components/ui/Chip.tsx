import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AppIcon } from './AppIcon';
import type { AppIconName } from './icons';

type Tone = 'default' | 'success' | 'info' | 'accent' | 'xp';

type Props = {
  label: string;
  icon?: AppIconName;
  tone?: Tone;
  style?: ViewStyle;
};

export function Chip({ label, icon, tone = 'default', style }: Props) {
  const { colors } = useTheme();

  const palette = {
    default: { bg: colors.background.secondary, fg: colors.text.secondary },
    success: { bg: colors.surface.success, fg: colors.surface.successText },
    info: { bg: colors.surface.info, fg: colors.surface.infoText },
    accent: { bg: colors.surface.accent, fg: colors.surface.accentText },
    xp: { bg: colors.surface.accent, fg: colors.surface.accentText },
  }[tone];

  return (
    <View style={[styles.chip, { backgroundColor: palette.bg }, style]}>
      {icon ? (
        <AppIcon name={icon} size={12} color={palette.fg} style={styles.icon} />
      ) : null}
      <Text style={[styles.text, { color: palette.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  icon: { marginRight: 4 },
  text: { fontSize: 12, fontWeight: '600' },
});
