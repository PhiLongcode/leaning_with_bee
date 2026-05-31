import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppPressable } from './AppPressable';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { AppIcon } from './AppIcon';

type Props = {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
};

/** Plain header (Đã lưu, …) — cùng layout hàng với HeaderGreen, không nền xanh */
export function HeaderPlain({ title, onBack, right }: Props) {
  const { colors, tokens, cardBg, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + 8,
          backgroundColor: cardBg,
          borderBottomColor: colors.border.tertiary,
        },
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.row}>
        {onBack ? (
          <AppPressable
            feedback="icon"
            onPress={onBack}
            hitSlop={12}
            style={styles.back}
            accessibilityRole="button"
          >
            <AppIcon name="arrowLeft" size={22} color={colors.text.primary} />
          </AppPressable>
        ) : (
          <View style={styles.backSpacer} />
        )}
        <Text style={[tokens.typography.heading1, styles.title, { color: colors.text.primary }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.right}>{right ?? <View style={styles.backSpacer} />}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 44,
  },
  back: { width: 40, alignItems: 'flex-start', justifyContent: 'center' },
  backSpacer: { width: 40 },
  title: { flex: 1, textAlign: 'left', marginLeft: 4 },
  right: { width: 40, alignItems: 'flex-end', justifyContent: 'center' },
});
