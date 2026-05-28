import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  addToCollection,
  createCollection,
  listCollectionItems,
  listCollections,
  DAILY_VOCABULARY_SEED,
  type CollectionItem,
  type LearningCollection,
} from '@hoc-cung-bee/features';
import { FeatureShell } from '../../components/FeatureShell';
import { Card } from '../../components/ui/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useDeviceId } from '../../hooks/useDeviceId';
import { getCollectionRepository } from '../../lib/featureRepos';
import { useTheme } from '../../theme/ThemeContext';

export function CollectionScreen() {
  const { colors } = useTheme();
  const deviceId = useDeviceId();
  const [collections, setCollections] = useState<LearningCollection[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listCollections(getCollectionRepository(), deviceId);
    if (result.ok) setCollections(result.value);
    setLoading(false);
  }, [deviceId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function selectCollection(id: string) {
    setSelected(id);
    const result = await listCollectionItems(getCollectionRepository(), id);
    if (result.ok) setItems(result.value);
  }

  async function create() {
    if (!title.trim()) return;
    await createCollection(getCollectionRepository(), deviceId, title.trim());
    setTitle('');
    await load();
  }

  async function addWord() {
    if (!selected) return;
    const v = DAILY_VOCABULARY_SEED[0];
    if (!v) return;
    await addToCollection(getCollectionRepository(), selected, 'vocabulary', v.id);
    await selectCollection(selected);
  }

  return (
    <FeatureShell title="Bộ sưu tập" req="REQ-04">
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card>
          <TextInput
            placeholder="Tên bộ học mới"
            placeholderTextColor={colors.text.tertiary}
            value={title}
            onChangeText={setTitle}
            style={[styles.input, { color: colors.text.primary, borderColor: colors.border.tertiary }]}
          />
          <PrimaryButton label="Tạo bộ học" onPress={() => void create()} />
        </Card>
        {loading ? <ActivityIndicator style={{ marginTop: 16 }} /> : null}
        {collections.map((c) => (
          <Card key={c.id} onPress={() => void selectCollection(c.id)} style={styles.item}>
            <Text style={{ color: colors.text.primary, fontWeight: '700' }}>{c.title}</Text>
            {selected === c.id ? (
              <View style={{ marginTop: 8 }}>
                <Text style={{ color: colors.text.secondary, fontSize: 12 }}>
                  {items.length} mục
                </Text>
                <PrimaryButton label="Thêm từ deploy" onPress={() => void addWord()} style={{ marginTop: 8 }} />
              </View>
            ) : null}
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
