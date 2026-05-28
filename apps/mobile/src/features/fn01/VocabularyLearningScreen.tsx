import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import { getVocabularyLesson, type Vocabulary } from '@hoc-cung-bee/features';
import { FeatureShell } from '../../components/FeatureShell';
import { PrimaryButton } from '../../components/PrimaryButton';
import { getVocabularyRepository } from '../../lib/vocabularyRepo';
import { useTheme } from '../../theme/ThemeContext';
import { brand } from '../../theme/colors';

export function VocabularyLearningScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<Vocabulary[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getVocabularyLesson(getVocabularyRepository(), 10);
      if (!result.ok) {
        setError(result.error);
        setItems([]);
      } else {
        setError(null);
        setItems(result.value);
      }
      setLoading(false);
    })();
  }, []);

  const current = items[index];

  const speak = useCallback(() => {
    if (!current) return;
    Speech.stop();
    Speech.speak(current.word, { language: 'en-US' });
  }, [current]);

  if (loading) {
    return (
      <FeatureShell title="Học từ vựng ngữ cảnh" req="REQ-01">
        <ActivityIndicator color={colors.surface.successText} />
      </FeatureShell>
    );
  }

  if (error || !current) {
    return (
      <FeatureShell title="Học từ vựng ngữ cảnh" req="REQ-01">
        <Text style={{ color: colors.text.secondary }}>{error ?? 'Không có từ trong bài học.'}</Text>
      </FeatureShell>
    );
  }

  return (
    <FeatureShell title="Học từ vựng ngữ cảnh" req="REQ-01">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.topic, { color: colors.text.tertiary }]}>{current.topic}</Text>
        <View style={styles.wordRow}>
          <Text style={[styles.word, { color: colors.text.primary }]}>{current.word}</Text>
          <Pressable
            onPress={speak}
            style={[styles.audioBtn, { backgroundColor: colors.surface.success }]}
            accessibilityLabel="Nghe phát âm"
          >
            <Text style={{ color: colors.surface.successText, fontSize: 18 }}>🔊</Text>
          </Pressable>
        </View>
        {current.pronunciation ? (
          <Text style={[styles.pron, { color: colors.text.secondary }]}>{current.pronunciation}</Text>
        ) : null}
        {current.partOfSpeech ? (
          <Text style={[styles.pos, { color: brand.xp }]}>{current.partOfSpeech}</Text>
        ) : null}
        <Text style={[styles.meaning, { color: colors.text.primary }]}>{current.meaning}</Text>

        <View style={[styles.block, { backgroundColor: colors.background.secondary, borderColor: colors.border.tertiary }]}>
          <Text style={[styles.label, { color: colors.surface.successText }]}>Ngữ cảnh</Text>
          <Text style={{ color: colors.text.primary, lineHeight: 22 }}>{current.context}</Text>
        </View>

        <View style={[styles.block, { backgroundColor: colors.background.secondary, borderColor: colors.border.tertiary }]}>
          <Text style={[styles.label, { color: colors.surface.successText }]}>Ví dụ</Text>
          <Text style={{ color: colors.text.primary, lineHeight: 22 }}>{current.example}</Text>
        </View>

        <Text style={[styles.counter, { color: colors.text.tertiary }]}>
          {index + 1} / {items.length}
        </Text>

        <View style={styles.nav}>
          <PrimaryButton
            label="Trước"
            onPress={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
          />
          <PrimaryButton
            label="Tiếp"
            onPress={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
            disabled={index >= items.length - 1}
          />
        </View>
      </ScrollView>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  topic: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  wordRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  word: { fontSize: 28, fontWeight: '700', flex: 1 },
  audioBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  pron: { fontSize: 14, marginBottom: 4 },
  pos: { fontSize: 12, fontWeight: '600', marginBottom: 12, textTransform: 'capitalize' },
  meaning: { fontSize: 16, lineHeight: 24, marginBottom: 16 },
  block: { padding: 14, borderRadius: 12, borderWidth: 0.5, marginBottom: 12 },
  label: { fontSize: 11, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  counter: { textAlign: 'center', fontSize: 12, marginVertical: 12 },
  nav: { flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
});
