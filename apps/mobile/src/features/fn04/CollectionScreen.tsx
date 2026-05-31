import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  listCollectionItems,
  listCollections,
  type CollectionItem,
  type LearningCollection,
} from '@hoc-cung-bee/features';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { FilterChip } from '../../components/ui/FilterChip';
import { HeaderPlain } from '../../components/ui/HeaderPlain';
import { useDeviceId } from '../../hooks/useDeviceId';
import { getCollectionRepository } from '../../lib/featureRepos';
import { useTheme } from '../../theme/ThemeContext';

const FILTERS = ['Tất cả', 'Part 1', 'Từ vựng', 'Câu mẫu'] as const;

export function CollectionScreen() {
  const { colors, brand, tokens, pageBg } = useTheme();
  const deviceId = useDeviceId();
  const [collections, setCollections] = useState<LearningCollection[]>([]);
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Tất cả');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listCollections(getCollectionRepository(), deviceId);
    if (result.ok) {
      setCollections(result.value);
      if (result.value[0]) {
        const itemsRes = await listCollectionItems(getCollectionRepository(), result.value[0].id);
        if (itemsRes.ok) setItems(itemsRes.value);
      }
    }
    setLoading(false);
  }, [deviceId]);

  useEffect(() => {
    void load();
  }, [load]);

  const isEmpty = !loading && collections.length === 0 && items.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: pageBg }}>
      <HeaderPlain title="Đã lưu" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipScroll}
      >
        {FILTERS.map((f) => (
          <FilterChip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} color={brand.primary} />
      ) : isEmpty ? (
        <EmptyState onRetry={() => void load()} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {collections.map((c) => (
            <Card key={c.id} style={styles.item}>
              <Text style={[tokens.typography.heading3, { color: colors.text.primary }]}>{c.title}</Text>
              <Text style={[tokens.typography.caption, { color: colors.text.tertiary, marginTop: 4 }]}>
                Bộ sưu tập
              </Text>
            </Card>
          ))}
          {items.map((item) => (
            <Card key={item.id} style={styles.item}>
              <Text style={[tokens.typography.bodyMedium, { color: brand.primary }]}>
                {item.itemType} · {item.itemId.slice(0, 8)}
              </Text>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chipScroll: { maxHeight: 52, marginBottom: 8 },
  chips: { paddingHorizontal: 20, paddingVertical: 8 },
  list: { paddingHorizontal: 20, paddingBottom: 24, gap: 12 },
  item: { marginBottom: 0 },
});
