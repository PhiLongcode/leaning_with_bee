import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { createSentence, deleteSentence, listSentences, type UserSentence } from '@hoc-cung-bee/features';
import { FeatureShell } from '../../components/FeatureShell';
import { Card } from '../../components/ui/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useDeviceId } from '../../hooks/useDeviceId';
import { getSentenceRepository } from '../../lib/featureRepos';
import { useTheme } from '../../theme/ThemeContext';

export function SentencesScreen() {
  const { colors } = useTheme();
  const deviceId = useDeviceId();
  const [items, setItems] = useState<UserSentence[]>([]);
  const [sentence, setSentence] = useState('');
  const [translation, setTranslation] = useState('');
  const [topic, setTopic] = useState('Standup');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listSentences(getSentenceRepository(), deviceId);
    if (result.ok) setItems(result.value);
    setLoading(false);
  }, [deviceId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    await createSentence(getSentenceRepository(), deviceId, {
      sentence,
      translation,
      context: 'User saved',
      topic,
    });
    setSentence('');
    setTranslation('');
    await load();
  }

  return (
    <FeatureShell title="Câu giao tiếp" req="REQ-03">
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card>
          <TextInput
            placeholder="Câu tiếng Anh"
            placeholderTextColor={colors.text.tertiary}
            value={sentence}
            onChangeText={setSentence}
            style={[styles.input, { color: colors.text.primary, borderColor: colors.border.tertiary }]}
          />
          <TextInput
            placeholder="Bản dịch"
            placeholderTextColor={colors.text.tertiary}
            value={translation}
            onChangeText={setTranslation}
            style={[styles.input, { color: colors.text.primary, borderColor: colors.border.tertiary }]}
          />
          <TextInput
            placeholder="Chủ đề (Standup, Scrum…)"
            placeholderTextColor={colors.text.tertiary}
            value={topic}
            onChangeText={setTopic}
            style={[styles.input, { color: colors.text.primary, borderColor: colors.border.tertiary }]}
          />
          <PrimaryButton label="Lưu câu" onPress={() => void save()} />
        </Card>
        {loading ? <ActivityIndicator style={{ marginTop: 16 }} /> : null}
        {items.map((s) => (
          <Card key={s.id} style={styles.item}>
            <Text style={{ color: colors.text.primary, fontWeight: '600' }}>{s.sentence}</Text>
            <Text style={{ color: colors.text.secondary, marginTop: 4 }}>{s.translation}</Text>
            <Text style={{ color: colors.text.tertiary, fontSize: 11, marginTop: 4 }}>{s.topic}</Text>
            <PrimaryButton
              label="Xóa"
              variant="secondary"
              onPress={() => void deleteSentence(getSentenceRepository(), s.id).then(load)}
              style={{ marginTop: 8 }}
            />
          </Card>
        ))}
      </ScrollView>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 10, fontSize: 14 },
  item: { marginTop: 10 },
});
