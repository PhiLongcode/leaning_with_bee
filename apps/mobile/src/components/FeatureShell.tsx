import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  title: string;
  req: string;
  children: ReactNode;
};

export function FeatureShell({ title, req, children }: Props) {
  const { colors } = useTheme();
  const setScreen = useAppStore((s) => s.setScreen);

  return (
    <View style={[styles.root, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.bar, { borderBottomColor: colors.border.tertiary }]}>
        <Pressable onPress={() => setScreen('home')} hitSlop={8}>
          <Text style={[styles.back, { color: colors.surface.successText }]}>← Trang chủ</Text>
        </Pressable>
        <Text style={[styles.req, { color: colors.text.tertiary }]}>{req}</Text>
      </View>
      <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 20 },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    marginBottom: 8,
  },
  back: { fontSize: 14, fontWeight: '600' },
  req: { fontSize: 11, fontWeight: '500' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
});
