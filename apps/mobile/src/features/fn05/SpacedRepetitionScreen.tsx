import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  getDueReviews,
  submitReview,
  type ProgressWithVocab,
  type ReviewRating,
} from '@hoc-cung-bee/features';
import { FeatureShell } from '../../components/FeatureShell';
import { Card } from '../../components/ui/Card';
import { SrsRatingRow } from '../../components/ui/SrsRatingRow';
import { useDeviceId } from '../../hooks/useDeviceId';
import { getLearningProgressRepository } from '../../lib/featureRepos';
import { awardXp } from '../../lib/gamification';
import { useTheme } from '../../theme/ThemeContext';

export function SpacedRepetitionScreen() {
  const { colors, brand, tokens } = useTheme();
  const deviceId = useDeviceId();
  const [queue, setQueue] = useState<ProgressWithVocab[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getDueReviews(getLearningProgressRepository(), deviceId);
    if (result.ok) {
      setQueue(result.value);
      setIndex(0);
    }
    setLoading(false);
  }, [deviceId]);

  useEffect(() => {
    void load();
  }, [load]);

  const current = queue[index];
  const progress = queue.length > 0 ? (index + 1) / queue.length : 0;

  async function rate(rating: ReviewRating) {
    if (!current) return;
    await submitReview(getLearningProgressRepository(), deviceId, current.vocabId, rating);
    await awardXp(deviceId, rating === 'easy' ? 15 : rating === 'good' ? 10 : 5);
    if (index < queue.length - 1) setIndex((i) => i + 1);
    else await load();
  }

  return (
    <FeatureShell title="Ôn tập" variant="green">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading ? <ActivityIndicator color={brand.primary} /> : null}
        {current ? (
          <Card>
            <View style={styles.progressWrap}>
              <View style={[styles.progressTrack, { backgroundColor: colors.border.tertiary }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: brand.primary, width: `${progress * 100}%` },
                  ]}
                />
              </View>
              <Text style={[tokens.typography.caption, { color: colors.text.tertiary, marginTop: 6 }]}>
                {index + 1} / {queue.length}
              </Text>
            </View>
            <Text style={[tokens.typography.h1, { color: colors.text.primary, marginTop: 8 }]}>
              {current.vocabulary?.word ?? current.vocabId}
            </Text>
            <Text style={[tokens.typography.body, { color: colors.text.secondary, marginTop: 8 }]}>
              {current.vocabulary?.meaning}
            </Text>
            {current.vocabulary?.context ? (
              <Text
                style={[
                  tokens.typography.body,
                  { color: colors.text.secondary, marginTop: 12, fontStyle: 'italic' },
                ]}
              >
                {current.vocabulary.context}
              </Text>
            ) : null}
            <Text style={[tokens.typography.caption, { color: colors.text.tertiary, marginTop: 16 }]}>
              Bạn nhớ từ này ở mức nào?
            </Text>
            <SrsRatingRow resetKey={current.vocabId} onRate={(r) => void rate(r)} />
          </Card>
        ) : !loading ? (
          <Text style={{ color: colors.text.tertiary, textAlign: 'center', marginTop: 24 }}>
            Không có từ đến hạn ôn.
          </Text>
        ) : null}
      </ScrollView>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  progressWrap: { marginBottom: 4 },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
});
