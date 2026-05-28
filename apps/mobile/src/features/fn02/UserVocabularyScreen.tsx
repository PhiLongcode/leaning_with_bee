import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  addVocabularyToMyList,
  listMyVocabulary,
  removeFromMyList,
  toggleDifficult,
  toggleFavorite,
  type UserVocabulary,
  DAILY_VOCABULARY_SEED,
} from '@hoc-cung-bee/features';
import { FeatureShell } from '../../components/FeatureShell';
import { Card } from '../../components/ui/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useDeviceId } from '../../hooks/useDeviceId';
import { getUserVocabularyRepository } from '../../lib/featureRepos';
import { useTheme } from '../../theme/ThemeContext';

export function UserVocabularyScreen() {
  const { colors } = useTheme();
  const deviceId = useDeviceId();
  const [items, setItems] = useState<UserVocabulary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listMyVocabulary(getUserVocabularyRepository(), deviceId);
    if (result.ok) setItems(result.value);
    setLoading(false);
  }, [deviceId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function addSample() {
    const vocab = DAILY_VOCABULARY_SEED[0];
    if (!vocab) return;
    await addVocabularyToMyList(getUserVocabularyRepository(), deviceId, vocab.id);
    await load();
  }

  return (
    <FeatureShell title="Sổ từ của tôi" req="REQ-02">
      <ScrollView contentContainerStyle={styles.scroll}>
        <PrimaryButton label="Thêm từ mẫu (deploy)" onPress={() => void addSample()} style={styles.addBtn} />
        {loading ? <ActivityIndicator color={colors.surface.successText} /> : null}
        {items.map((item) => (
          <Card key={item.id} style={styles.card}>
            <Text style={{ color: colors.text.primary, fontWeight: '700', fontSize: 16 }}>
              {item.vocabulary?.word ?? item.vocabId}
            </Text>
            <Text style={{ color: colors.text.secondary, marginTop: 4 }}>
              {item.vocabulary?.meaning ?? ''}
            </Text>
            <View style={styles.row}>
              <Pressable
                onPress={() => void toggleFavorite(getUserVocabularyRepository(), item.id, !item.isFavorite).then(load)}
              >
                <Text style={{ color: item.isFavorite ? '#FFC800' : colors.text.tertiary }}>
                  {item.isFavorite ? '★ Yêu thích' : '☆ Yêu thích'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => void toggleDifficult(getUserVocabularyRepository(), item.id, !item.isDifficult).then(load)}
              >
                <Text style={{ color: item.isDifficult ? colors.surface.successText : colors.text.tertiary }}>
                  {item.isDifficult ? '⚡ Khó' : 'Đánh dấu khó'}
                </Text>
              </Pressable>
              <Pressable onPress={() => void removeFromMyList(getUserVocabularyRepository(), item.id).then(load)}>
                <Text style={{ color: '#FF4B4B' }}>Xóa</Text>
              </Pressable>
            </View>
          </Card>
        ))}
        {!loading && items.length === 0 ? (
          <Text style={{ color: colors.text.tertiary, textAlign: 'center' }}>Chưa có từ — thêm từ mẫu hoặc từ bài học FN-01.</Text>
        ) : null}
      </ScrollView>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  addBtn: { marginBottom: 16 },
  card: { marginBottom: 10 },
  row: { flexDirection: 'row', gap: 16, marginTop: 12, flexWrap: 'wrap' },
});
