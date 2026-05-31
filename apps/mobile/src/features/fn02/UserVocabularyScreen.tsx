import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  enrichVocabulary,
  listMyVocabulary,
  removeFromMyList,
  saveEnrichedVocabulary,
  toggleDifficult,
  toggleFavorite,
  type UserVocabulary,
  type VocabEnrichMode,
  type VocabEnrichResult,
} from '@hoc-cung-bee/features';
import { DialogueBubbleList } from '../../components/vocab/DialogueBubbleList';
import { ExplanationNativeCard } from '../../components/vocab/ExplanationNativeCard';
import { FeatureShell } from '../../components/FeatureShell';
import { Card } from '../../components/ui/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useDeviceId } from '../../hooks/useDeviceId';
import {
  getUserVocabularyRepository,
  getVocabEnrichRepository,
  getVocabularyWriteRepository,
} from '../../lib/featureRepos';
import { useAppPermissions } from '../../store/permissionsStore';
import { useNativeLanguage } from '../../store/localeStore';
import { useTheme } from '../../theme/ThemeContext';

const ROLES = ['PM', 'DEV', 'BA', 'Tester', 'Customer', 'DevOps'] as const;

export function UserVocabularyScreen() {
  const { colors, brand } = useTheme();
  const deviceId = useDeviceId();
  const nativeLanguage = useNativeLanguage();
  const permissions = useAppPermissions();
  const [items, setItems] = useState<UserVocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<VocabEnrichMode>('full');
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [context, setContext] = useState('');
  const [topic, setTopic] = useState('Software Development');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['PM', 'DEV']);
  const [preview, setPreview] = useState<VocabEnrichResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listMyVocabulary(getUserVocabularyRepository(), deviceId);
    if (result.ok) setItems(result.value);
    setLoading(false);
  }, [deviceId]);

  useEffect(() => {
    void load();
  }, [load]);

  function toggleRole(role: string) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  }

  async function generatePreview() {
    setError(null);
    setAiLoading(true);
    const result = await enrichVocabulary(getVocabEnrichRepository(deviceId), {
      mode,
      word: word.trim(),
      meaning: meaning.trim() || null,
      context: context.trim() || null,
      topic: topic.trim() || null,
      workplaceRoles: selectedRoles,
      nativeLanguage,
    });
    setAiLoading(false);
    if (!result.ok) {
      setError(result.error);
      setPreview(null);
      return;
    }
    setPreview(result.value);
  }

  async function savePreview() {
    if (!preview) return;
    setSaveLoading(true);
    setError(null);
    const result = await saveEnrichedVocabulary(
      getVocabularyWriteRepository(),
      deviceId,
      preview,
    );
    setSaveLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPreview(null);
    setWord('');
    setMeaning('');
    setContext('');
    await load();
  }

  const aiEnabled = permissions.allowAiVocabEnrich;

  return (
    <FeatureShell title="Sổ từ của tôi" req="REQ-02 · FN-17">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card variant="outline" style={styles.formCard}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Thêm từ mới</Text>
          <View style={styles.modeRow}>
            {(['full', 'enrich'] as const).map((m) => (
              <Pressable
                key={m}
                onPress={() => setMode(m)}
                style={[
                  styles.modeBtn,
                  {
                    backgroundColor: mode === m ? colors.surface.success : colors.background.secondary,
                    borderColor: colors.border.tertiary,
                  },
                ]}
              >
                <Text style={{ color: mode === m ? colors.surface.successText : colors.text.secondary, fontSize: 12 }}>
                  {m === 'full' ? 'AI tạo đầy đủ' : 'Bổ sung phần thiếu'}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            placeholder="Từ tiếng Anh *"
            value={word}
            onChangeText={setWord}
            style={[styles.input, { color: colors.text.primary, borderColor: colors.border.tertiary }]}
            testID="add-vocab-word"
          />
          <TextInput
            placeholder={mode === 'enrich' ? 'Nghĩa (tuỳ chọn nếu có context/example)' : 'Nghĩa (AI sinh nếu để trống)'}
            value={meaning}
            onChangeText={setMeaning}
            style={[styles.input, { color: colors.text.primary, borderColor: colors.border.tertiary }]}
          />
          <TextInput
            placeholder="Context (tuỳ chọn)"
            value={context}
            onChangeText={setContext}
            style={[styles.input, { color: colors.text.primary, borderColor: colors.border.tertiary }]}
          />
          <TextInput
            placeholder="Topic"
            value={topic}
            onChangeText={setTopic}
            style={[styles.input, { color: colors.text.primary, borderColor: colors.border.tertiary }]}
          />
          <Text style={[styles.hint, { color: colors.text.tertiary }]}>Vai trong hội thoại</Text>
          <View style={styles.roleRow}>
            {ROLES.map((role) => {
              const active = selectedRoles.includes(role);
              return (
                <Pressable
                  key={role}
                  onPress={() => toggleRole(role)}
                  style={[
                    styles.roleChip,
                    {
                      backgroundColor: active ? colors.surface.info : colors.background.secondary,
                      borderColor: active ? colors.surface.infoText : colors.border.tertiary,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 11, color: active ? colors.surface.infoText : colors.text.secondary }}>
                    {role}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {aiEnabled ? (
            <PrimaryButton
              label={aiLoading ? 'Đang tạo…' : 'Tạo hội thoại AI'}
              onPress={() => void generatePreview()}
              disabled={!word.trim() || aiLoading}
              style={{ marginTop: 8 }}
            />
          ) : (
            <Text style={{ color: colors.text.tertiary, marginTop: 8, fontSize: 12 }}>
              AI enrich đã tắt bởi admin.
            </Text>
          )}
          {error ? <Text style={{ color: brand.error, marginTop: 8 }}>{error}</Text> : null}
        </Card>

        {preview ? (
          <Card style={styles.previewCard} testID="add-vocab-preview">
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Xem trước</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text.primary }}>{preview.word}</Text>
            <Text style={{ color: colors.text.secondary, marginVertical: 6 }}>{preview.meaning}</Text>
            <DialogueBubbleList dialogue={preview.dialogue} highlightWord={preview.word} />
            <View style={{ marginTop: 12 }}>
              <ExplanationNativeCard explanation={preview.explanationNative} />
            </View>
            <PrimaryButton
              label={saveLoading ? 'Đang lưu…' : 'Lưu vào sổ'}
              onPress={() => void savePreview()}
              disabled={saveLoading}
              style={{ marginTop: 12 }}
            />
          </Card>
        ) : null}

        {loading ? <ActivityIndicator color={brand.primary} style={{ marginTop: 16 }} /> : null}
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
          <Text style={{ color: colors.text.tertiary, textAlign: 'center', marginTop: 12 }}>
            Chưa có từ — dùng form trên để thêm bằng AI.
          </Text>
        ) : null}
      </ScrollView>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  formCard: { marginBottom: 16 },
  previewCard: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    fontSize: 15,
  },
  hint: { fontSize: 12, marginBottom: 6 },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  roleChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  card: { marginBottom: 10 },
  row: { flexDirection: 'row', gap: 16, marginTop: 12, flexWrap: 'wrap' },
});
