import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isSupabaseConfigured } from '../config/env';
import { appVersionLabel } from '../config/version';
import { CuderLogo } from '../components/brand/CuderLogo';
import { useBrandRuntime } from '../store/brandStore';
import { AppIcon } from '../components/ui/AppIcon';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { FeatureRow } from '../components/ui/FeatureRow';
import { QUICK_LINK_ICON } from '../components/ui/icons';
import { SectionHeader } from '../components/ui/SectionHeader';
import { LEARNING_DAYS } from '@hoc-cung-bee/features';
import { FEATURES, QUICK_LINK_SCREENS } from '../navigation/screens';
import { isScreenAllowed } from '../lib/featurePermissions';
import { useAppStore } from '../store/appStore';
import { useAppPermissions } from '../store/permissionsStore';
import { useTheme } from '../theme/ThemeContext';

const QUICK_LINKS = Object.keys(QUICK_LINK_SCREENS) as (keyof typeof QUICK_LINK_SCREENS)[];

function dbStatusTone(status: string): 'success' | 'info' | 'accent' | 'default' {
  if (status === 'connected') return 'success';
  if (status === 'not_configured' || status === 'schema_missing') return 'accent';
  return 'default';
}

function dbStatusShort(status: string): string {
  if (status === 'connected') return 'DB OK';
  if (status === 'not_configured') return 'Chưa cấu hình';
  if (status === 'schema_missing') return 'Thiếu schema';
  return 'DB —';
}

export function HomeScreen() {
  const { colors, brand, tokens, isDark } = useTheme();
  const permissions = useAppPermissions();
  const insets = useSafeAreaInsets();
  const deviceId = useAppStore((s) => s.deviceId);
  const streak = useAppStore((s) => s.streak);
  const xp = useAppStore((s) => s.xp);
  const dbConnection = useAppStore((s) => s.dbConnection);
  const lessonDay = useAppStore((s) => s.lessonDay);
  const setLessonDay = useAppStore((s) => s.setLessonDay);
  const setScreen = useAppStore((s) => s.setScreen);
  const activeDay = LEARNING_DAYS.find((d) => d.dayNumber === lessonDay) ?? LEARNING_DAYS[0];

  const gradientColors = isDark
    ? (['#2D4A1A', '#1C1F1A'] as const)
    : ([brand.primary, brand.primaryPressed] as const);

  const quickLinks = QUICK_LINKS.filter((label) =>
    isScreenAllowed(QUICK_LINK_SCREENS[label], permissions),
  );
  const visibleFeatures = FEATURES.filter((f) => isScreenAllowed(f.screen, permissions));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background.primary }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + tokens.spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[tokens.typography.h2, { color: colors.text.primary }]}>Chào bạn!</Text>
          <Text style={[styles.subGreeting, { color: colors.text.secondary }]}>
            Sẵn sàng học cùng Cuder hôm nay?
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Chip label={String(streak)} icon="streak" tone="xp" />
          <Chip label={`${xp} XP`} icon="xp" tone="info" />
          <Chip label={dbStatusShort(dbConnection.status)} tone={dbStatusTone(dbConnection.status)} />
          <Pressable
            onPress={() => setScreen('settings')}
            style={[styles.settingsBtn, { backgroundColor: colors.background.elevated }, tokens.shadow.card]}
            accessibilityLabel="Cài đặt"
          >
            <AppIcon name="settings" size={18} color={colors.text.secondary} />
          </Pressable>
        </View>
      </View>

      <SectionHeader title="Lộ trình 7 ngày" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayRow}
        style={styles.dayScroll}
      >
        {LEARNING_DAYS.map((d) => {
          const active = d.dayNumber === lessonDay;
          return (
            <Pressable
              key={d.dayNumber}
              onPress={() => setLessonDay(d.dayNumber)}
              style={[
                styles.dayPill,
                {
                  backgroundColor: active ? colors.surface.success : colors.background.elevated,
                  borderColor: active ? colors.surface.successText : colors.border.tertiary,
                },
                !isDark && !active && tokens.shadow.card,
              ]}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: active ? colors.surface.successText : colors.text.tertiary,
                }}
              >
                {d.title}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: active ? colors.text.primary : colors.text.secondary,
                  marginTop: 2,
                }}
                numberOfLines={1}
              >
                {d.subtitle}
              </Text>
              <Text style={{ fontSize: 10, color: colors.text.tertiary, marginTop: 4 }}>
                {d.wordCount} từ
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        testID="home-start-lesson"
        onPress={() => setScreen('fn01_vocabulary')}
        style={styles.heroWrap}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>THỬ THÁCH HÔM NAY</Text>
            </View>
            <CuderLogo size="md" />
          </View>
          <Text style={styles.heroTitle}>
            {activeDay?.subtitle ?? 'Workplace English'}
          </Text>
          <View style={styles.heroSubRow}>
            <Text style={styles.heroSub}>
              {activeDay?.title ?? 'Ngày 1'} · 10 từ vựng ngữ cảnh →
            </Text>
            <AppIcon name="chevronRight" size={12} color="rgba(255,255,255,0.9)" />
          </View>
        </LinearGradient>
      </Pressable>

      <View style={styles.courseRow}>
        <Card style={styles.courseCard} onPress={() => setScreen('fn01_vocabulary')}>
          <AppIcon name="workplace" size={26} color={colors.surface.infoText} style={styles.courseIcon} />
          <Text style={[styles.courseTitle, { color: colors.text.primary }]}>Workplace</Text>
          <Text style={[styles.courseSub, { color: colors.text.tertiary }]}>English</Text>
        </Card>
        <Card style={styles.courseCard} variant="outline">
          <AppIcon name="developer" size={26} color={colors.text.tertiary} style={styles.courseIcon} />
          <Text style={[styles.courseTitle, { color: colors.text.primary }]}>Developer</Text>
          <Text style={[styles.courseSub, { color: colors.text.tertiary }]}>Sắp ra mắt</Text>
        </Card>
      </View>

      <Card onPress={() => setScreen('settings')} style={styles.settingsCard}>
        <View style={styles.settingsCardInner}>
          <View style={[styles.settingsIcon, { backgroundColor: colors.surface.info }]}>
            <AppIcon name="link" size={20} color={colors.surface.infoText} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.settingsTitle, { color: colors.text.primary }]}>
              Cài đặt & hệ thống
            </Text>
            <Text style={[styles.settingsSub, { color: colors.text.secondary }]}>
              {isSupabaseConfigured ? 'Môi trường, DB, phiên bản' : 'Cấu hình Supabase (.env)'}
            </Text>
          </View>
          <AppIcon name="chevronRight" size={16} color={brand.primary} />
        </View>
      </Card>

      <SectionHeader title="Truy cập nhanh" />
      <Card variant="default" style={styles.listCard}>
        {quickLinks.map((label, i) => (
          <FeatureRow
            key={label}
            icon={QUICK_LINK_ICON[label] ?? 'sparkle'}
            title={label}
            onPress={() => setScreen(QUICK_LINK_SCREENS[label])}
            last={i === quickLinks.length - 1}
          />
        ))}
      </Card>

      <SectionHeader title="Tất cả module" />
      <Card variant="default" style={styles.listCard}>
        {visibleFeatures.map((f, i) => (
          <FeatureRow
            key={f.screen}
            icon="module"
            title={f.title}
            subtitle={f.req}
            badge="LIVE"
            testID={`feature-row-${f.screen}`}
            onPress={() => setScreen(f.screen)}
            last={i === visibleFeatures.length - 1}
          />
        ))}
      </Card>

      <Text style={[styles.meta, { color: colors.text.tertiary }]}>{appVersionLabel}</Text>
      {deviceId ? (
        <Text style={[styles.meta, { color: colors.text.tertiary }]}>Device: {deviceId.slice(0, 8)}…</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  headerLeft: { flex: 1 },
  headerRight: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end', maxWidth: 140 },
  subGreeting: { fontSize: 14, marginTop: 4 },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayScroll: { marginBottom: 12, marginHorizontal: -20 },
  dayRow: { paddingHorizontal: 20, gap: 10, paddingBottom: 4 },
  dayPill: {
    width: 120,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  heroWrap: { marginBottom: 16, borderRadius: 20, overflow: 'hidden' },
  hero: { padding: 20, borderRadius: 20, minHeight: 140 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  heroBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.6 },
  heroTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3, marginBottom: 6 },
  heroSubRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
  courseRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  courseCard: { flex: 1, alignItems: 'flex-start', padding: 14 },
  courseIcon: { marginBottom: 8 },
  courseTitle: { fontSize: 15, fontWeight: '700' },
  courseSub: { fontSize: 12, marginTop: 2 },
  settingsCard: { marginBottom: 8 },
  settingsCardInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingsIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingsTitle: { fontSize: 15, fontWeight: '600' },
  settingsSub: { fontSize: 12, marginTop: 2 },
  listCard: { paddingVertical: 4, paddingHorizontal: 14, marginBottom: 8 },
  meta: { fontSize: 11, marginTop: 20, textAlign: 'center', lineHeight: 16 },
});
