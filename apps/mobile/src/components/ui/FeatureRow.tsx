import { StyleSheet, Text, View } from 'react-native';
import { AppPressable } from './AppPressable';
import { useTheme } from '../../theme/ThemeContext';
import { AppIcon } from './AppIcon';
import type { AppIconName } from './icons';

type Props = {
  icon: AppIconName;
  title: string;
  subtitle?: string;
  badge?: string;
  onPress: () => void;
  last?: boolean;
  testID?: string;
};

export function FeatureRow({ icon, title, subtitle, badge, onPress, last, testID }: Props) {
  const { colors } = useTheme();

  return (
    <AppPressable
      testID={testID}
      feedback="opacity"
      onPress={onPress}
      style={[
        styles.row,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border.tertiary },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.surface.info }]}>
        <AppIcon name={icon} size={18} color={colors.surface.infoText} />
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.text.tertiary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: colors.surface.accent }]}>
          <Text style={[styles.badgeText, { color: colors.surface.accentText }]}>{badge}</Text>
        </View>
      ) : null}
      <AppIcon name="chevronRight" size={14} color={colors.text.tertiary} />
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, minWidth: 0 },
  title: { fontSize: 15, fontWeight: '600' },
  subtitle: { fontSize: 12, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '700' },
});
