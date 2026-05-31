import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppPressable } from '../../components/ui/AppPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDashboardStats, type DashboardStats } from '@hoc-cung-bee/features';
import { Card } from '../../components/ui/Card';
import { WeeklyStudyChart } from '../../components/ui/WeeklyStudyChart';
import { CuderLogo } from '../../components/brand/CuderLogo';
import { AppIcon } from '../../components/ui/AppIcon';
import { useDeviceId } from '../../hooks/useDeviceId';
import { getDashboardRepository } from '../../lib/featureRepos';
import { useAppStore } from '../../store/appStore';
import { surface, surfaceDark } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

/** Phút học 7 ngày (placeholder đến khi API weekly có) — hôm nay từ wordsLearnedToday */
function weeklyMinutesFromStats(stats: DashboardStats): number[] {
  const todayMins = Math.min(60, stats.wordsLearnedToday * 3 + Math.floor(stats.xp / 20));
  const base = [8, 14, 6, 22, 12, 18, todayMins];
  return base.map((m, i) => (i === 6 ? todayMins : m));
}

export function DashboardScreen() {
  const { colors, brand, tokens, pageBg, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const deviceId = useDeviceId();
  const setScreen = useAppStore((s) => s.setScreen);
  const applyGamification = useAppStore((s) => s.applyGamification);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getDashboardStats(getDashboardRepository(), deviceId);
    if (result.ok) {
      setStats(result.value);
      applyGamification({ streak: result.value.streak, xp: result.value.xp });
    }
    setLoading(false);
  }, [deviceId, applyGamification]);

  useEffect(() => {
    void load();
  }, [load]);

  const overall = stats ? Math.min(100, Math.round((stats.xp / 500) * 100)) : 0;
  const weeklyMinutes = useMemo(() => (stats ? weeklyMinutesFromStats(stats) : [0, 0, 0, 0, 0, 0, 0]), [stats]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: pageBg }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 24 }}
    >
      <View style={styles.topActions}>
        <View style={{ flex: 1 }} />
        <AppPressable feedback="opacity" onPress={() => setScreen('settings')} style={styles.settingsLink}>
          <Text style={[tokens.typography.bodyMedium, { color: colors.text.secondary }]}>Cài đặt</Text>
          <AppIcon name="settings" size={18} color={brand.primaryText} />
        </AppPressable>
      </View>

      <View style={styles.profile}>
        <View style={[styles.avatar, { backgroundColor: brand.primaryLight }]}>
          <CuderLogo size="md" />
        </View>
        <Text style={[tokens.typography.display, { color: colors.text.primary, marginTop: 12 }]}>
          Nguyễn Phi Long
        </Text>
        <Text style={[tokens.typography.caption, { color: brand.primaryText, marginTop: 4 }]}>
          @{deviceId.slice(0, 8)}
        </Text>
      </View>

      {loading ? <ActivityIndicator style={{ marginVertical: 24 }} color={brand.primary} /> : null}

      {stats ? (
        <>
          <Text style={[tokens.typography.heading1, styles.sectionOut, { color: colors.text.primary }]}>
            Thống kê: 7 ngày gần nhất
          </Text>
          <Card style={styles.statCard}>
            <View style={styles.ringRow}>
              <View style={[styles.ring, { borderColor: brand.primary }]}>
                <Text style={[tokens.typography.display, { color: brand.primary }]}>{overall}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <SkillBar label="Nghe" icon="speaking" current={stats.wordsLearnedToday} total={495} />
                <SkillBar label="Đọc" icon="vocabulary" current={stats.reviewsDue} total={495} />
              </View>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <Text style={[tokens.typography.heading3, { color: colors.text.primary }]}>Thời gian học gần đây</Text>
            <WeeklyStudyChart minutesByDay={weeklyMinutes} />
          </Card>

          <Card style={styles.statCard}>
            <Text style={[tokens.typography.heading3, { color: colors.text.primary }]}>Tổng thể</Text>
            <View style={styles.legend}>
              <LegendDot color={brand.primary} label="Đúng" />
              <LegendDot color={brand.error} label="Sai" />
              <LegendDot color="#9E9E9E" label="Chưa làm" />
            </View>
            <View style={styles.miniStats}>
              <Text style={[tokens.typography.body, { color: colors.text.secondary }]}>
                Streak {stats.streak} · XP {stats.xp}
              </Text>
              <Text style={[tokens.typography.caption, { color: colors.text.tertiary, marginTop: 4 }]}>
                Hôm nay: {stats.wordsLearnedToday} từ · {stats.reviewsDue} bài ôn
              </Text>
            </View>
            <AppPressable
              feedback="button"
              rippleColor="rgba(255,255,255,0.25)"
              onPress={() => setScreen('fn05_spaced_repetition')}
              style={[styles.pillCta, { backgroundColor: brand.primary }]}
            >
              <Text style={[tokens.typography.button, { color: '#FFFFFF' }]}>Xem lịch sử học</Text>
            </AppPressable>
          </Card>
        </>
      ) : null}
    </ScrollView>
  );
}

function SkillBar({
  label,
  icon,
  current,
  total,
}: {
  label: string;
  icon: 'speaking' | 'vocabulary';
  current: number;
  total: number;
}) {
  const { brand, colors, tokens, isDark } = useTheme();
  const trackBg = isDark ? surfaceDark.progressTrack : surface.progressTrack;
  const pct = Math.min(1, current / Math.max(total, 1));

  return (
    <View style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <AppIcon name={icon} size={16} color={brand.primary} />
        <Text style={[tokens.typography.captionBold, { color: colors.text.primary, flex: 1 }]}>{label}</Text>
        <Text style={[tokens.typography.caption, { color: colors.text.secondary }]}>
          {current} / {total}
        </Text>
      </View>
      <View style={[barStyles.track, { backgroundColor: trackBg }]}>
        <View style={[barStyles.fill, { width: `${pct * 100}%`, backgroundColor: brand.primary }]} />
      </View>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  const { tokens, colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, marginTop: 8 }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color, marginRight: 6 }} />
      <Text style={[tokens.typography.caption, { color: colors.text.tertiary }]}>{label}</Text>
    </View>
  );
}

const barStyles = StyleSheet.create({
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
});

const styles = StyleSheet.create({
  topActions: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 8 },
  settingsLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  profile: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionOut: { paddingHorizontal: 20, marginBottom: 8, marginTop: 8 },
  statCard: { marginHorizontal: 20, marginBottom: 12 },
  ringRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ring: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: { flexDirection: 'row', flexWrap: 'wrap' },
  miniStats: { marginTop: 8, marginBottom: 16 },
  pillCta: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
  },
});
