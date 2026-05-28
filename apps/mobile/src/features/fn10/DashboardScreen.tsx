import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getDashboardStats, type DashboardStats } from '@hoc-cung-bee/features';
import { FeatureShell } from '../../components/FeatureShell';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { useDeviceId } from '../../hooks/useDeviceId';
import { getDashboardRepository } from '../../lib/featureRepos';
import { useAppStore } from '../../store/appStore';
import { useTheme } from '../../theme/ThemeContext';

export function DashboardScreen() {
  const { colors, tokens } = useTheme();
  const deviceId = useDeviceId();
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

  return (
    <FeatureShell title="Tiến độ học tập" req="REQ-10">
      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? <ActivityIndicator /> : null}
        {stats ? (
          <>
            <View style={styles.row}>
              <Card style={styles.stat}>
                <Chip label="Streak" tone="xp" />
                <Text style={[tokens.typography.h1, { color: colors.text.primary, marginTop: 8 }]}>
                  {stats.streak}
                </Text>
                <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>ngày liên tiếp</Text>
              </Card>
              <Card style={styles.stat}>
                <Chip label="XP" tone="info" />
                <Text style={[tokens.typography.h1, { color: colors.text.primary, marginTop: 8 }]}>
                  {stats.xp}
                </Text>
                <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>điểm tích lũy</Text>
              </Card>
            </View>
            <Card style={{ marginTop: 12 }}>
              <Text style={{ color: colors.text.primary, fontWeight: '600' }}>Hôm nay</Text>
              <Text style={{ color: colors.text.secondary, marginTop: 8 }}>
                Đã học {stats.wordsLearnedToday} từ · {stats.reviewsDue} bài ôn đang chờ
              </Text>
            </Card>
          </>
        ) : null}
      </ScrollView>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  row: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, alignItems: 'flex-start' },
});
