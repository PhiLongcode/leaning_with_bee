import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  DEFAULT_REMINDER_WINDOW,
  getNotificationSettings,
  saveNotificationSettings,
  type NotificationSettings,
  type ReminderWindowPrefs,
} from '@hoc-cung-bee/features';
import { FeatureShell } from '../../components/FeatureShell';
import { Card } from '../../components/ui/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useDeviceId } from '../../hooks/useDeviceId';
import { getNotificationRepository } from '../../lib/featureRepos';
import {
  getNotificationPermissionStatus,
  sendTestReminderNotification,
  syncReminderNotifications,
} from '../../lib/reminderNotifications';
import { loadReminderWindowPrefs, saveReminderWindowPrefs } from '../../lib/reminderSchedulePrefs';
import { FONT_FAMILY } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeContext';

export function NotificationsScreen() {
  const { colors } = useTheme();
  const deviceId = useDeviceId();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [windowPrefs, setWindowPrefs] = useState<ReminderWindowPrefs>(DEFAULT_REMINDER_WINDOW);
  const [permission, setPermission] = useState<string>('—');
  const [scheduledCount, setScheduledCount] = useState(0);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [settingsResult, localPrefs] = await Promise.all([
      getNotificationSettings(getNotificationRepository(), deviceId),
      loadReminderWindowPrefs(),
    ]);
    if (settingsResult.ok) {
      const s = settingsResult.value;
      setSettings(s);
      setWindowPrefs({
        windowStartHour: s.windowStartHour ?? localPrefs.windowStartHour,
        windowEndHour: s.windowEndHour ?? localPrefs.windowEndHour,
        intervalHours: s.intervalHours ?? localPrefs.intervalHours,
      });
    } else {
      setWindowPrefs(localPrefs);
    }
    setPermission(await getNotificationPermissionStatus());
    setLoading(false);
  }, [deviceId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveAndSchedule() {
    if (!settings) return;
    setStatusMsg(null);
    const merged = {
      ...settings,
      windowStartHour: windowPrefs.windowStartHour,
      windowEndHour: windowPrefs.windowEndHour,
      intervalHours: windowPrefs.intervalHours,
    };
    const saveResult = await saveNotificationSettings(getNotificationRepository(), merged);
    if (!saveResult.ok) {
      setStatusMsg(saveResult.error);
      return;
    }
    setSettings(merged);
    await saveReminderWindowPrefs(windowPrefs);
    const sync = await syncReminderNotifications(deviceId, merged, windowPrefs);
    setScheduledCount(sync.scheduled);
    setPermission(sync.permission);
    setStatusMsg(
      settings.enabled
        ? `Đã lên lịch ${sync.scheduled} mốc nhắc/ngày (ưu tiên từ đến hạn ôn).`
        : 'Đã tắt nhắc — hủy lịch local.',
    );
  }

  function patchWindow(patch: Partial<ReminderWindowPrefs>) {
    setWindowPrefs((p) => ({ ...p, ...patch }));
  }

  if (!settings) {
    return (
      <FeatureShell title="Nhắc học" req="REQ-11">
        {loading ? <ActivityIndicator /> : null}
      </FeatureShell>
    );
  }

  const webNote = Platform.OS === 'web' ? 'Thông báo chỉ hoạt động trên Android/iOS.' : null;

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
          <Text style={{ color: colors.text.tertiary, fontSize: 12, marginTop: 8 }}>
            Quyền hệ thống: {permission}
            {scheduledCount > 0 ? ` · ${scheduledCount} mốc/ngày` : ''}
          </Text>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Khung giờ nhắc</Text>
          <Text style={{ color: colors.text.secondary, fontSize: 12, marginBottom: 8 }}>
            Chia đều trong ngày (vd. 8h–20h, mỗi 3h). Nội dung ưu tiên từ đến hạn SRS.
          </Text>
          <Field
            label="Bắt đầu (0–23h)"
            value={String(windowPrefs.windowStartHour)}
            onChange={(t) => patchWindow({ windowStartHour: clamp(23, Number(t) || 0) })}
            colors={colors}
          />
          <Field
            label="Kết thúc (0–23h)"
            value={String(windowPrefs.windowEndHour)}
            onChange={(t) => patchWindow({ windowEndHour: clamp(23, Number(t) || 0) })}
            colors={colors}
          />
          <Field
            label="Khoảng cách (giờ)"
            value={String(windowPrefs.intervalHours)}
            onChange={(t) => patchWindow({ intervalHours: clamp(12, Math.max(1, Number(t) || 1)) })}
            colors={colors}
          />
        </Card>

        <Card style={{ marginTop: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Mốc neo (tuỳ chọn)</Text>
          <Field
            label="Giờ (0–23)"
            value={String(settings.reminderHour)}
            onChange={(t) =>
              setSettings({ ...settings, reminderHour: clamp(23, Number(t) || 0) })
            }
            colors={colors}
          />
          <Field
            label="Phút (0–59)"
            value={String(settings.reminderMinute)}
            onChange={(t) =>
              setSettings({ ...settings, reminderMinute: clamp(59, Number(t) || 0) })
            }
            colors={colors}
          />
        </Card>

        <PrimaryButton
          label="Lưu & lên lịch nhắc"
          onPress={() => void saveAndSchedule()}
          style={{ marginTop: 16 }}
        />
        {Platform.OS !== 'web' ? (
          <PrimaryButton
            label="Gửi thử sau 5 giây"
            variant="secondary"
            onPress={() => void sendTestReminderNotification(deviceId)}
            style={{ marginTop: 8 }}
          />
        ) : null}
        {statusMsg ? (
          <Text style={{ color: colors.surface.successText, marginTop: 12, lineHeight: 20 }}>
            {statusMsg}
          </Text>
        ) : null}
        {webNote ? (
          <Text style={{ color: colors.text.tertiary, fontSize: 12, marginTop: 12 }}>{webNote}</Text>
        ) : null}
      </ScrollView>
    </FeatureShell>
  );
}

function Field({
  label,
  value,
  onChange,
  colors,
}: {
  label: string;
  value: string;
  onChange: (t: string) => void;
  colors: { text: { primary: string }; border: { tertiary: string } };
}) {
  return (
    <View style={{ marginTop: 8 }}>
      <Text style={{ color: colors.text.primary, fontSize: 12, opacity: 0.7 }}>{label}</Text>
      <TextInput
        keyboardType="number-pad"
        value={value}
        onChangeText={onChange}
        style={{
          borderWidth: 1,
          borderRadius: 10,
          padding: 12,
          marginTop: 4,
          fontSize: 16,
          lineHeight: 22,
          fontFamily: FONT_FAMILY.content,
          color: colors.text.primary,
          borderColor: colors.border.tertiary,
        }}
      />
    </View>
  );
}

function clamp(max: number, n: number) {
  return Math.min(max, Math.max(0, n));
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
});
