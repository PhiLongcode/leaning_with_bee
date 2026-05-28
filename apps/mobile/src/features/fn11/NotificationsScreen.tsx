import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import {
  getNotificationSettings,
  saveNotificationSettings,
  type NotificationSettings,
} from '@hoc-cung-bee/features';
import { FeatureShell } from '../../components/FeatureShell';
import { Card } from '../../components/ui/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useDeviceId } from '../../hooks/useDeviceId';
import { getNotificationRepository } from '../../lib/featureRepos';
import { useTheme } from '../../theme/ThemeContext';

export function NotificationsScreen() {
  const { colors } = useTheme();
  const deviceId = useDeviceId();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getNotificationSettings(getNotificationRepository(), deviceId);
    if (result.ok) setSettings(result.value);
    setLoading(false);
  }, [deviceId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!settings) return;
    const result = await saveNotificationSettings(getNotificationRepository(), settings);
    if (result.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  if (!settings) {
    return (
      <FeatureShell title="Nhắc học" req="REQ-11">
        {loading ? <ActivityIndicator /> : null}
      </FeatureShell>
    );
  }

  return (
    <FeatureShell title="Nhắc học" req="REQ-11">
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card>
          <View style={styles.row}>
            <Text style={{ color: colors.text.primary, fontWeight: '600' }}>Bật nhắc học</Text>
            <Switch
              value={settings.enabled}
              onValueChange={(enabled) => setSettings({ ...settings, enabled })}
              trackColor={{ true: colors.surface.successText }}
            />
          </View>
          <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 16 }}>Giờ nhắc (0–23)</Text>
          <TextInput
            keyboardType="number-pad"
            value={String(settings.reminderHour)}
            onChangeText={(t) =>
              setSettings({ ...settings, reminderHour: Math.min(23, Math.max(0, Number(t) || 0)) })
            }
            style={[styles.input, { color: colors.text.primary, borderColor: colors.border.tertiary }]}
          />
          <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 8 }}>Phút (0–59)</Text>
          <TextInput
            keyboardType="number-pad"
            value={String(settings.reminderMinute)}
            onChangeText={(t) =>
              setSettings({ ...settings, reminderMinute: Math.min(59, Math.max(0, Number(t) || 0)) })
            }
            style={[styles.input, { color: colors.text.primary, borderColor: colors.border.tertiary }]}
          />
          <PrimaryButton label="Lưu cài đặt" onPress={() => void save()} style={{ marginTop: 12 }} />
          {saved ? (
            <Text style={{ color: colors.surface.successText, marginTop: 8, textAlign: 'center' }}>
              Đã lưu — nhắc local sẽ áp dụng khi bật push (Expo Notifications).
            </Text>
          ) : null}
        </Card>
        <Text style={{ color: colors.text.tertiary, fontSize: 12, marginTop: 12, lineHeight: 18 }}>
          MVP: lưu cài đặt trên thiết bị/DB. Tích hợp `expo-notifications` để lên lịch daily & review due.
        </Text>
      </ScrollView>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 6, fontSize: 16 },
});
