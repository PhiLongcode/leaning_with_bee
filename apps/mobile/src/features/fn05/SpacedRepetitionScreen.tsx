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
import { PrimaryButton } from '../../components/PrimaryButton';
import { useDeviceId } from '../../hooks/useDeviceId';
import { getLearningProgressRepository } from '../../lib/featureRepos';
import { awardXp } from '../../lib/gamification';
import { useTheme } from '../../theme/ThemeContext';

const RATINGS: { label: string; rating: ReviewRating }[] = [
  { label: 'Again', rating: 'again' },
  { label: 'Hard', rating: 'hard' },
  { label: 'Good', rating: 'good' },
  { label: 'Easy', rating: 'easy' },
];

export function SpacedRepetitionScreen() {
  const { colors } = useTheme();
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

  async function rate(rating: ReviewRating) {
    if (!current) return;
    await submitReview(getLearningProgressRepository(), deviceId, current.vocabId, rating);
    await awardXp(deviceId, rating === 'easy' ? 15 : rating === 'good' ? 10 : 5);
    if (index < queue.length - 1) setIndex((i) => i + 1);
    else await load();
  }

  return (
    <FeatureShell title="Spaced Repetition" req="REQ-05">
      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? <ActivityIndicator /> : null}
        {current ? (
          <Card>
            <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>
              {index + 1} / {queue.length}
            </Text>
            <Text style={[styles.word, { color: colors.text.primary }]}>
              {current.vocabulary?.word ?? current.vocabId}
            </Text>
            <Text style={{ color: colors.text.secondary, marginTop: 8 }}>
              {current.vocabulary?.meaning}
            </Text>
            <Text style={{ color: colors.text.secondary, marginTop: 12, fontStyle: 'italic' }}>
              {current.vocabulary?.context}
            </Text>
            <View style={styles.ratings}>
              {RATINGS.map((r) => (
                <PrimaryButton
                  key={r.rating}
                  label={r.label}
                  variant="secondary"
                  onPress={() => void rate(r.rating)}
                  style={styles.rateBtn}
                />
              ))}
            </View>
          </Card>
        ) : (
          <Text style={{ color: colors.text.tertiary, textAlign: 'center' }}>Không có từ đến hạn ôn.</Text>
        )}
      </ScrollView>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  word: { fontSize: 28, fontWeight: '700', marginTop: 8 },
  ratings: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 20 },
  rateBtn: { minWidth: '45%' },
});
