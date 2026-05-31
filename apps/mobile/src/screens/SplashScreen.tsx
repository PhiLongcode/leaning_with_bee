import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { CuderLogo } from '../components/brand/CuderLogo';
import { useBrandRuntime } from '../store/brandStore';
import { AppIcon } from '../components/ui/AppIcon';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme/ThemeContext';

export function SplashScreen() {
  const { colors, tokens, pageBg, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const setScreen = useAppStore((s) => s.setScreen);
  const brand = useBrandRuntime();
  const bg = isDark ? colors.background.primary : pageBg;

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View style={[styles.inner, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 32 }]}>
        <View style={[styles.mascotRing, { backgroundColor: colors.background.elevated }, tokens.shadow.card]}>
          <CuderLogo size="hero" />
        </View>

        <Text style={[tokens.typography.h1, styles.title, { color: colors.text.primary }]}>
          {brand.brandName}
        </Text>
        {brand.brandSubtitle ? (
          <Text style={[styles.subtitle, { color: colors.text.tertiary }]}>{brand.brandSubtitle}</Text>
        ) : null}
        <Text style={[tokens.typography.body, styles.tagline, { color: colors.text.secondary }]}>
          {brand.brandTagline}
        </Text>

        <View style={styles.pills}>
          <View style={[styles.pill, { backgroundColor: colors.surface.success }]}>
            <AppIcon name="vocabulary" size={14} color={colors.surface.successText} />
            <Text style={[tokens.typography.captionBold, { color: colors.surface.successText }]}>
              Ngữ cảnh thực tế
            </Text>
          </View>
          <View style={[styles.pill, { backgroundColor: colors.surface.info }]}>
            <AppIcon name="streak" size={14} color={colors.surface.infoText} />
            <Text style={[tokens.typography.captionBold, { color: colors.surface.infoText }]}>
              Streak & XP
            </Text>
          </View>
        </View>

        <View style={styles.cta}>
          <PrimaryButton title="BẮT ĐẦU HỌC" testID="splash-start-btn" onPress={() => setScreen('home')} />
        </View>

        <Text style={[styles.footer, { color: colors.text.tertiary }]}>
          {brand.brandName} · Workplace English
        </Text>
      </View>
    </View>
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
  title: { textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 12, fontWeight: '600', letterSpacing: 1, textAlign: 'center', marginBottom: 4 },
  tagline: { textAlign: 'center', marginBottom: 28 },
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
