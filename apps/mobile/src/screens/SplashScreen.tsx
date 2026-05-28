import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme/ThemeContext';
export function SplashScreen() {
  const { colors } = useTheme();
  const setScreen = useAppStore((s) => s.setScreen);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Text style={styles.mascot}>🐝</Text>
      <Text style={[styles.title, { color: colors.text.primary }]}>Học cùng Bee</Text>
      <Text style={[styles.tagline, { color: colors.text.secondary }]}>
        Học tiếng Anh công việc — cùng Bee mỗi ngày
      </Text>
      <View style={styles.cta}>
        <PrimaryButton title="BẮT ĐẦU HỌC" onPress={() => setScreen('home')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  mascot: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 8 },
  tagline: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 32 },
  cta: { width: '100%', maxWidth: 320 },
});
