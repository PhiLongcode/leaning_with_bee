import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { isSupabaseConfigured } from '../lib/supabase';
import { FEATURES, QUICK_LINK_SCREENS } from '../navigation/screens';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme/ThemeContext';
import { brand } from '../theme/colors';

const QUICK_LINKS = Object.keys(QUICK_LINK_SCREENS) as (keyof typeof QUICK_LINK_SCREENS)[];

export function HomeScreen() {
  const { colors } = useTheme();
  const deviceId = useAppStore((s) => s.deviceId);
  const setScreen = useAppStore((s) => s.setScreen);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background.primary }}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.chip, { backgroundColor: colors.surface.success, color: colors.surface.successText }]}>
          🔥 0
        </Text>
        <Text style={[styles.xp, { color: brand.xp }]}>⭐ 0 XP</Text>
      </View>

      <Text style={[styles.greeting, { color: colors.text.primary }]}>Chào bạn!</Text>

      <Pressable
        onPress={() => setScreen('fn01_vocabulary')}
        style={[styles.card, { backgroundColor: colors.background.secondary, borderColor: colors.border.tertiary }]}
      >
        <Text style={[styles.cardTitle, { color: colors.surface.successText }]}>Thử thách hôm nay</Text>
        <Text style={{ color: colors.text.secondary, fontSize: 14 }}>10 từ vựng theo ngữ cảnh →</Text>
      </Pressable>

      <Text style={[styles.section, { color: colors.text.secondary }]}>Khóa / bộ học</Text>
      <View style={[styles.card, { backgroundColor: colors.background.secondary, borderColor: colors.border.tertiary }]}>
        <Text style={{ color: colors.text.primary }}>🏢 Workplace English</Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.background.secondary, borderColor: colors.border.tertiary }]}>
        <Text style={{ color: colors.text.primary }}>💻 Developer Vocab</Text>
      </View>

      <Text style={[styles.section, { color: colors.text.secondary }]}>Tính năng</Text>
      {QUICK_LINKS.map((label) => (
        <Pressable
          key={label}
          onPress={() => setScreen(QUICK_LINK_SCREENS[label])}
          style={[styles.linkRow, { borderColor: colors.border.tertiary }]}
        >
          <Text style={{ color: colors.text.primary, fontSize: 14 }}>{label}</Text>
        </Pressable>
      ))}

      <Text style={[styles.section, { color: colors.text.secondary }]}>Tất cả module (FN)</Text>
      {FEATURES.map((f) => (
        <Pressable
          key={f.screen}
          onPress={() => setScreen(f.screen)}
          style={[styles.linkRow, { borderColor: colors.border.tertiary }]}
        >
          <Text style={{ color: colors.text.primary, fontSize: 14 }}>
            {f.req} — {f.title}
          </Text>
        </Pressable>
      ))}

      <Text style={[styles.meta, { color: colors.text.tertiary }]}>
        Supabase: {isSupabaseConfigured ? 'đã cấu hình' : 'mock data (.env)'}
        {deviceId ? `\nDevice: ${deviceId.slice(0, 8)}…` : ''}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  chip: { fontSize: 12, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  xp: { fontSize: 12, fontWeight: '600' },
  greeting: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 0.5,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  section: { fontSize: 11, fontWeight: '500', textTransform: 'uppercase', marginTop: 12, marginBottom: 8, letterSpacing: 0.5 },
  linkRow: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  meta: { fontSize: 11, marginTop: 24, lineHeight: 16 },
});
