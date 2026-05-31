import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppPressable } from './AppPressable';
import { AppIcon } from './AppIcon';
import type { AppIconName } from './icons';
import { useTheme } from '../../theme/ThemeContext';

type Props = {
  icon?: AppIconName;
  title: string;
  /** Dòng phụ xám (vd. «Xem thông tin») */
  subtitle?: string;
  /** Giá trị xanh lá (vd. «Chế độ sáng», «Tiếng Việt») */
  value?: string;
  onPress?: () => void;
  last?: boolean;
  /** Thay icon trái (avatar profile) */
  left?: ReactNode;
  showChevron?: boolean;
};

export function SettingsListRow({
  icon,
  title,
  subtitle,
  value,
  onPress,
  last,
  left,
  showChevron = !!onPress,
}: Props) {
  const { brand, colors, tokens } = useTheme();

  const body = (
    <View style={[styles.row, !last && { borderBottomColor: colors.border.tertiary, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      {left ? (
        <View style={styles.leftSlot}>{left}</View>
      ) : icon ? (
        <View style={[styles.iconWrap, { backgroundColor: brand.primaryLight }]}>
          <AppIcon name={icon} size={18} color={brand.primaryText} />
        </View>
      ) : null}
      <View style={styles.center}>
        <Text style={[tokens.typography.bodyMedium, { color: colors.text.primary, fontWeight: '600' }]}>{title}</Text>
        {subtitle ? (
          <Text style={[tokens.typography.caption, { color: colors.text.tertiary, marginTop: 2 }]}>{subtitle}</Text>
        ) : null}
        {value && !subtitle ? (
          <Text style={[tokens.typography.caption, { color: brand.primaryText, marginTop: 2, fontWeight: '600' }]}>
            {value}
          </Text>
        ) : null}
      </View>
      {value && subtitle ? (
        <Text style={[tokens.typography.caption, styles.valueAside, { color: brand.primaryText, fontWeight: '600' }]}>
          {value}
        </Text>
      ) : null}
      {showChevron && onPress ? (
        <AppIcon name="chevronRight" size={12} color={colors.text.tertiary} />
      ) : null}
    </View>
  );

  if (!onPress) return body;

  return (
    <AppPressable feedback="opacity" onPress={onPress} accessibilityRole="button">
      {body}
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
    minHeight: 56,
  },
  leftSlot: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, minWidth: 0 },
  valueAside: { marginRight: 4 },
});
