import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { BeeLogo } from '../components/brand/BeeLogo';
import { AppIcon } from '../components/ui/AppIcon';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme/ThemeContext';

export function SplashScreen() {
  const { colors, tokens, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const setScreen = useAppStore((s) => s.setScreen);

  const bgColors = isDark
    ? ([colors.background.primary, '#1A2E14'] as const)
    : ([colors.background.primary, '#E8F5D6'] as const);

  return (
    <LinearGradient colors={bgColors} style={styles.root}>
      <View style={[styles.inner, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 32 }]}>
        <View style={[styles.mascotRing, { backgroundColor: colors.background.elevated }, tokens.shadow.card]}>
          <BeeLogo size="hero" />
        </View>

        <Text style={[tokens.typography.h1, styles.title, { color: colors.text.primary }]}>
          Học cùng Bee
        </Text>
        <Text style={[styles.tagline, { color: colors.text.secondary }]}>
          Học tiếng Anh công việc —{'\n'}cùng Bee mỗi ngày
        </Text>

        <View style={styles.pills}>
          <View style={[styles.pill, { backgroundColor: colors.surface.success }]}>
            <AppIcon name="vocabulary" size={14} color={colors.surface.successText} />
            <Text style={{ color: colors.surface.successText, fontSize: 12, fontWeight: '600' }}>
              Ngữ cảnh thực tế
            </Text>
          </View>
          <View style={[styles.pill, { backgroundColor: colors.surface.info }]}>
            <AppIcon name="streak" size={14} color={colors.surface.infoText} />
            <Text style={{ color: colors.surface.infoText, fontSize: 12, fontWeight: '600' }}>
              Streak & XP
            </Text>
          </View>
        </View>

        <View style={styles.cta}>
          <PrimaryButton title="BẮT ĐẦU HỌC" onPress={() => setScreen('home')} />
        </View>

        <Text style={[styles.footer, { color: colors.text.tertiary }]}>Học cùng Bee · Workplace English</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  inner: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  mascotRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { textAlign: 'center', marginBottom: 12 },
  tagline: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 28 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 40 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  cta: { width: '100%', maxWidth: 320 },
  footer: { fontSize: 11, marginTop: 24 },
});
