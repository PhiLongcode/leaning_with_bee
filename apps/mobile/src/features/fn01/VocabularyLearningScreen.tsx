import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import { getVocabularyLesson, LEARNING_DAYS, type Vocabulary } from '@hoc-cung-bee/features';
import { FeatureShell } from '../../components/FeatureShell';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AppIcon } from '../../components/ui/AppIcon';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { addVocabularyToMyList } from '@hoc-cung-bee/features';
import { useDeviceId } from '../../hooks/useDeviceId';
import { getUserVocabularyRepository } from '../../lib/featureRepos';
import { awardXp } from '../../lib/gamification';
import { getVocabularyRepository } from '../../lib/vocabularyRepo';
import { useAppStore } from '../../store/appStore';
import { useTheme } from '../../theme/ThemeContext';
import { brand } from '../../theme/colors';

export function VocabularyLearningScreen() {
  const { colors, brand: themeBrand, tokens } = useTheme();
  const deviceId = useDeviceId();
  const lessonDay = useAppStore((s) => s.lessonDay);
  const dayMeta = LEARNING_DAYS.find((d) => d.dayNumber === lessonDay);
  const [items, setItems] = useState<Vocabulary[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getVocabularyLesson(getVocabularyRepository(), lessonDay, 10);
      if (!result.ok) {
        setError(result.error);
        setItems([]);
      } else {
        setError(null);
        setItems(result.value);
      }
      setLoading(false);
    })();
  }, [lessonDay]);

  const current = items[index];
  const progress = items.length > 0 ? (index + 1) / items.length : 0;

  const speak = useCallback(() => {
    if (!current) return;
    Speech.stop();
    Speech.speak(current.word, { language: 'en-US' });
  }, [current]);

  if (loading) {
    return (
      <FeatureShell
        title={dayMeta ? `${dayMeta.title} — ${dayMeta.subtitle}` : 'Học từ vựng ngữ cảnh'}
        req="REQ-01"
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={themeBrand.primary} />
          <Text style={{ color: colors.text.secondary, marginTop: 12 }}>Đang tải bài học…</Text>
        </View>
      </FeatureShell>
    );
  }

  if (error || !current) {
    return (
      <FeatureShell title="Học từ vựng ngữ cảnh" req="REQ-01">
        <Card variant="outline">
          <Text style={{ color: colors.text.secondary, lineHeight: 22 }}>
            {error ?? 'Không có từ trong bài học.'}
          </Text>
        </Card>
      </FeatureShell>
    );
  }

  return (
    <FeatureShell
      title={dayMeta ? `${dayMeta.title} — ${dayMeta.subtitle}` : 'Học từ vựng ngữ cảnh'}
      req={`REQ-01 · ${items.length} từ`}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.progressWrap}>
          <View style={[styles.progressTrack, { backgroundColor: colors.border.tertiary }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: themeBrand.primary, width: `${progress * 100}%` },
              ]}
            />
          </View>
          <Text style={[styles.progressLabel, { color: colors.text.tertiary }]}>
            {index + 1} / {items.length}
          </Text>
        </View>

        <Chip label={current.topic} tone="info" style={styles.topicChip} />

        <View style={styles.wordRow}>
          <Text style={[tokens.typography.h1, styles.word, { color: colors.text.primary }]}>
            {current.word}
          </Text>
          <Pressable
            onPress={speak}
            style={[styles.audioBtn, { backgroundColor: colors.surface.success }]}
            accessibilityLabel="Nghe phát âm"
          >
            <AppIcon name="volume" size={20} color={colors.surface.successText} />
          </Pressable>
        </View>

        {current.pronunciation ? (
          <Text style={[styles.pron, { color: colors.text.secondary }]}>{current.pronunciation}</Text>
        ) : null}
        {current.partOfSpeech ? (
          <Text style={[styles.pos, { color: brand.xp }]}>{current.partOfSpeech}</Text>
        ) : null}
        <Text style={[styles.meaning, { color: colors.text.primary }]}>{current.meaning}</Text>

        <Card style={styles.block}>
          <Text style={[styles.blockLabel, { color: colors.surface.successText }]}>Ngữ cảnh</Text>
          <Text style={[tokens.typography.body, { color: colors.text.primary }]}>{current.context}</Text>
        </Card>

        <Card style={styles.block}>
          <Text style={[styles.blockLabel, { color: colors.surface.infoText }]}>Ví dụ</Text>
          <Text style={[tokens.typography.body, { color: colors.text.primary }]}>{current.example}</Text>
        </Card>

        <PrimaryButton
          label="Thêm vào sổ của tôi"
          variant="secondary"
          onPress={() => void addVocabularyToMyList(getUserVocabularyRepository(), deviceId, current.id)}
          style={{ marginBottom: 12 }}
        />

        <View style={styles.nav}>
          <PrimaryButton
            label="Trước"
            variant="secondary"
            onPress={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            style={styles.navBtn}
          />
          <PrimaryButton
            label="Tiếp"
            onPress={() => {
              void awardXp(deviceId, 5);
              setIndex((i) => Math.min(items.length - 1, i + 1));
            }}
            disabled={index >= items.length - 1}
            style={styles.navBtn}
          />
        </View>
      </ScrollView>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32, paddingTop: 8 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 48 },
  progressWrap: { marginBottom: 16 },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressLabel: { fontSize: 12, textAlign: 'right', marginTop: 6, fontWeight: '600' },
  topicChip: { alignSelf: 'flex-start', marginBottom: 12 },
  wordRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  word: { flex: 1, fontSize: 32 },
  audioBtn: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  pron: { fontSize: 15, marginBottom: 4 },
  pos: { fontSize: 12, fontWeight: '700', marginBottom: 12, textTransform: 'capitalize' },
  meaning: { fontSize: 17, lineHeight: 26, marginBottom: 16, fontWeight: '500' },
  block: { marginBottom: 12 },
  blockLabel: { fontSize: 11, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 },
  nav: { flexDirection: 'row', gap: 12, marginTop: 8 },
  navBtn: { flex: 1 },
});
