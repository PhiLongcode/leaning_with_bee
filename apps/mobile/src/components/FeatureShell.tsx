import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from './ui/AppIcon';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  title: string;
  req?: string;
  children: ReactNode;
};

export function FeatureShell({ title, req, children }: Props) {
  const { colors, tokens } = useTheme();
  const setScreen = useAppStore((s) => s.setScreen);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: colors.background.primary, paddingTop: insets.top }]}>
      <View style={[styles.bar, { borderBottomColor: colors.border.tertiary }]}>
        <Pressable
          onPress={() => setScreen('home')}
          hitSlop={12}
          style={[styles.backBtn, { backgroundColor: colors.background.secondary }]}
        >
          <AppIcon name="arrowLeft" size={18} color={colors.text.primary} />
        </Pressable>
        <View style={styles.barCenter}>
          <Text style={[styles.title, { color: colors.text.primary }, tokens.typography.h3]} numberOfLines={1}>
            {title}
          </Text>
          {req ? (
            <Text style={[styles.req, { color: colors.text.tertiary }]}>{req}</Text>
          ) : null}
        </View>
        <View style={styles.barSpacer} />
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barCenter: { flex: 1 },
  barSpacer: { width: 40 },
  title: {},
  req: { fontSize: 11, marginTop: 2, fontWeight: '500' },
  body: { flex: 1, paddingHorizontal: 20 },
});
