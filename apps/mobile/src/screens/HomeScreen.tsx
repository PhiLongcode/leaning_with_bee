import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppPressable } from '../components/ui/AppPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDueReviews } from '@hoc-cung-bee/features';
import { CuderLogo } from '../components/brand/CuderLogo';
import { AppIcon } from '../components/ui/AppIcon';
import { PracticeCard } from '../components/ui/PracticeCard';
import { useDeviceId } from '../hooks/useDeviceId';
import { getLearningProgressRepository } from '../lib/featureRepos';
import { useBrandRuntime } from '../store/brandStore';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme/ThemeContext';

/**
 * Trang chủ — hub luồng học MVP (LEARNING_FLOW §2).
 * Chỉ điểm vào: Bài học (REQ-01), Ôn SRS (REQ-05), Context Review (REQ-06).
 * Tab khác (Gia sư AI, Đã lưu, Từ vựng, Tài khoản) → bottom nav — không lặp trên Home.
 */
export function HomeScreen() {
  const { colors, brand, tokens, pageBg, cardBg, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const deviceId = useDeviceId();
  const brandMeta = useBrandRuntime();
  const streak = useAppStore((s) => s.streak);
  const xp = useAppStore((s) => s.xp);
  const setScreen = useAppStore((s) => s.setScreen);
  const displayName = 'Bạn học';
  const [dueCount, setDueCount] = useState(0);
  const avatarBg = isDark ? colors.surface.success : brand.primaryLight;

  useEffect(() => {
    if (!deviceId) return;
    void (async () => {
      const result = await getDueReviews(getLearningProgressRepository(), deviceId);
      if (result.ok) setDueCount(result.value.length);
    })();
  }, [deviceId]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: pageBg }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + tokens.spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <CuderLogo size="sm" />
          <Text style={[tokens.typography.heading3, { color: brand.primary, marginLeft: 8 }]}>
            {brandMeta.brandName}
          </Text>
        </View>
      </View>

      <View style={styles.greetingRow}>
        <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
          <CuderLogo size="sm" />
        </View>
        <View style={styles.greetingText}>
          <Text style={[tokens.typography.caption, { color: colors.text.secondary }]}>Xin chào</Text>
          <Text style={[tokens.typography.display, { color: colors.text.primary }]}>{displayName}</Text>
          <View style={styles.statsRow}>
            <Text style={[tokens.typography.captionBold, { color: brand.primary }]}>🔥 {streak}</Text>
            <Text style={[tokens.typography.captionBold, { color: brand.xp, marginLeft: 12 }]}>⭐ {xp} XP</Text>
          </View>
        </View>
      </View>

      <Text style={[tokens.typography.caption, styles.hint, { color: colors.text.tertiary }]}>
        Lộ trình hôm nay · Workplace English
      </Text>

      <AppPressable
        testID="home-start-lesson"
        feedback="card"
        onPress={() => setScreen('fn01_vocabulary')}
        style={[styles.primaryCard, tokens.shadow.card, { backgroundColor: cardBg, borderColor: brand.primary }]}
      >
        <View style={styles.primaryCardTop}>
          <View style={[styles.primaryIcon, { backgroundColor: colors.surface.success }]}>
            <AppIcon name="vocabulary" size={22} color={colors.surface.successText} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[tokens.typography.heading2, { color: colors.text.primary }]}>Bài học hôm nay</Text>
            <Text style={[tokens.typography.caption, { color: colors.text.secondary, marginTop: 4 }]}>
              10 từ ngữ cảnh công việc + hội thoại
            </Text>
          </View>
          <AppIcon name="chevronRight" size={16} color={brand.primary} />
        </View>
        <Text style={[tokens.typography.captionBold, { color: brand.blue, marginTop: 12 }]}>Bắt đầu học</Text>
      </AppPressable>

      {dueCount > 0 ? (
        <AppPressable
          feedback="card"
          onPress={() => setScreen('fn05_spaced_repetition')}
          style={[
            styles.secondaryCard,
            { backgroundColor: cardBg, borderColor: colors.border.tertiary },
            tokens.shadow.card,
          ]}
        >
          <AppIcon name="review" size={20} color={brand.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[tokens.typography.heading3, { color: colors.text.primary }]}>Việc hôm nay</Text>
            <Text style={[tokens.typography.caption, { color: colors.text.secondary, marginTop: 2 }]}>
              {dueCount} từ cần ôn spaced repetition
            </Text>
          </View>
          <AppIcon name="chevronRight" size={14} color={brand.primary} />
        </AppPressable>
      ) : null}

      <Text style={[tokens.typography.heading1, styles.sectionTitle, { color: colors.text.primary }]}>
        Sau bài học
      </Text>
      <PracticeCard
        title="Context Review"
        subLabel="Quiz ngữ cảnh · Part 1"
        subIcon="review"
        onPress={() => setScreen('fn06_context_review')}
      />

      <Text style={[tokens.typography.caption, styles.tabHint, { color: colors.text.tertiary }]}>
        Gia sư AI · Đã lưu · Từ vựng · Tiến độ & cài đặt — dùng thanh tab phía dưới.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 28 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingText: { flex: 1 },
  statsRow: { flexDirection: 'row', marginTop: 4 },
  hint: { marginBottom: 12 },
  primaryCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    marginBottom: 12,
  },
  primaryCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  primaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  sectionTitle: { marginBottom: 12 },
  tabHint: { marginTop: 20, textAlign: 'center', lineHeight: 18 },
});
