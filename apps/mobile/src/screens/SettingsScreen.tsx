import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import {
  NATIVE_LANGUAGE_LABELS,
  SUPPORTED_NATIVE_LANGUAGES,
} from '@hoc-cung-bee/features';
import { DatabaseStatusCard } from '../components/DatabaseStatusCard';
import { FeatureShell } from '../components/FeatureShell';
import { SettingsRow, SettingsSection } from '../components/SettingsSection';
import { appEnv, env, isSupabaseConfigured, maskSecret } from '../config/env';
import { androidVersionCode, appVersion, appVersionLabel, iosBuildNumber } from '../config/version';
import { refreshDatabaseStatus } from '../lib/refreshDatabaseStatus';
import {
  getSoundSettings,
  playAnswerCorrect,
  playAnswerWrong,
  playReminder,
  setSoundSettings,
} from '../services/soundFeedback';
import { useAppStore } from '../store/appStore';
import { AppIcon } from '../components/ui/AppIcon';
import type { AppIconName } from '../components/ui/icons';
import { useTheme, type ThemeMode } from '../theme/ThemeContext';
import {
  getNativeLanguageLabel,
  useLocaleStore,
  useNativeLanguage,
} from '../store/localeStore';

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: AppIconName }[] = [
  { mode: 'light', label: 'Sáng', icon: 'sun' },
  { mode: 'dark', label: 'Tối', icon: 'moon' },
  { mode: 'system', label: 'Hệ thống', icon: 'system' },
];

export function SettingsScreen() {
  const { colors, mode, setMode, brand: brandColors } = useTheme();
  const deviceId = useAppStore((s) => s.deviceId);
  const dbConnection = useAppStore((s) => s.dbConnection);
  const dbChecking = useAppStore((s) => s.dbChecking);
  const [studySfxEnabled, setStudySfxEnabled] = useState(getSoundSettings().studySfxEnabled);
  const [reminderSfxEnabled, setReminderSfxEnabled] = useState(getSoundSettings().reminderSfxEnabled);
  const nativeLanguage = useNativeLanguage();
  const setNativeLanguage = useLocaleStore((s) => s.setNativeLanguage);
  const [langPickerOpen, setLangPickerOpen] = useState(false);

  useEffect(() => {
    void refreshDatabaseStatus();
  }, []);

  const updateStudySfx = (enabled: boolean) => {
    setStudySfxEnabled(enabled);
    setSoundSettings({ studySfxEnabled: enabled });
  };

  const updateReminderSfx = (enabled: boolean) => {
    setReminderSfxEnabled(enabled);
    setSoundSettings({ reminderSfxEnabled: enabled });
  };

  return (
    <FeatureShell title="Cài đặt">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <DatabaseStatusCard
          state={dbConnection}
          configOk={isSupabaseConfigured}
          onRefresh={() => void refreshDatabaseStatus()}
          refreshing={dbChecking}
        />

        <SettingsSection title="Giao diện">
          <View style={styles.themeRow}>
            {THEME_OPTIONS.map((opt) => {
              const active = mode === opt.mode;
              return (
                <Pressable
                  key={opt.mode}
                  onPress={() => setMode(opt.mode)}
                  style={[
                    styles.themeBtn,
                    {
                      backgroundColor: active ? colors.surface.success : colors.background.secondary,
                      borderColor: active ? colors.surface.successText : colors.border.tertiary,
                    },
                  ]}
                >
                  <AppIcon
                    name={opt.icon}
                    size={16}
                    color={active ? colors.surface.successText : colors.text.secondary}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: active ? '700' : '500',
                      color: active ? colors.surface.successText : colors.text.secondary,
                      marginTop: 4,
                    }}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <SettingsRow
            label="Ngôn ngữ mẹ đẻ"
            value={getNativeLanguageLabel(nativeLanguage)}
            onPress={() => setLangPickerOpen(true)}
          />
        </SettingsSection>

        {langPickerOpen ? (
          <SettingsSection title="Chọn ngôn ngữ mẹ đẻ">
            {SUPPORTED_NATIVE_LANGUAGES.map((code, i) => (
              <SettingsRow
                key={code}
                label={NATIVE_LANGUAGE_LABELS[code]}
                value={nativeLanguage === code ? '✓' : ''}
                onPress={() => {
                  void setNativeLanguage(code);
                  setLangPickerOpen(false);
                }}
                last={i === SUPPORTED_NATIVE_LANGUAGES.length - 1}
              />
            ))}
          </SettingsSection>
        ) : null}

        <SettingsSection title="Âm thanh">
          <View style={[styles.soundRow, { borderBottomColor: colors.border.tertiary }]}>
            <View style={styles.soundLabelWrap}>
              <Text style={[styles.soundLabel, { color: colors.text.primary }]}>Âm thanh học tập</Text>
              <Text style={[styles.soundHint, { color: colors.text.secondary }]}>Đúng / sai khi chọn đáp án</Text>
            </View>
            <Switch
              value={studySfxEnabled}
              onValueChange={updateStudySfx}
              trackColor={{ false: colors.border.primary, true: brandColors.primary }}
            />
          </View>
          <View style={[styles.soundRow, { borderBottomColor: colors.border.tertiary }]}>
            <View style={styles.soundLabelWrap}>
              <Text style={[styles.soundLabel, { color: colors.text.primary }]}>Âm thanh nhắc nhở</Text>
              <Text style={[styles.soundHint, { color: colors.text.secondary }]}>Khi mở thông báo nhắc học</Text>
            </View>
            <Switch
              value={reminderSfxEnabled}
              onValueChange={updateReminderSfx}
              trackColor={{ false: colors.border.primary, true: brandColors.primary }}
            />
          </View>
          <View style={styles.previewRow}>
            <Pressable
              style={[styles.previewBtn, { backgroundColor: colors.surface.success }]}
              onPress={() => void playAnswerCorrect()}
            >
              <Text style={{ color: colors.surface.successText, fontWeight: '600', fontSize: 13 }}>Nghe đúng</Text>
            </Pressable>
            <Pressable
              style={[styles.previewBtn, { backgroundColor: '#FCEBEB' }]}
              onPress={() => void playAnswerWrong()}
            >
              <Text style={{ color: brandColors.error, fontWeight: '600', fontSize: 13 }}>Nghe sai</Text>
            </Pressable>
            <Pressable
              style={[styles.previewBtn, { backgroundColor: colors.surface.info }]}
              onPress={() => void playReminder('default')}
            >
              <Text style={{ color: colors.surface.infoText, fontWeight: '600', fontSize: 13 }}>Nghe nhắc</Text>
            </Pressable>
          </View>
        </SettingsSection>

        <SettingsSection title="Môi trường">
          <SettingsRow label="Chế độ" value={appEnv === 'production' ? 'Production' : 'Development'} />
          <SettingsRow label="Tên app" value={env.appName} />
          <SettingsRow label="Supabase project" value={env.projectRef ?? '—'} mono />
          <SettingsRow
            label="Supabase URL"
            value={isSupabaseConfigured ? env.supabaseUrl : 'Chưa cấu hình'}
            mono
          />
          <SettingsRow
            label="Anon key"
            value={isSupabaseConfigured ? maskSecret(env.supabaseAnonKey) : '—'}
            mono
            last
          />
        </SettingsSection>

        <SettingsSection title="Phiên bản">
          <SettingsRow label="Phiên bản" value={appVersionLabel} />
          <SettingsRow label="Version" value={appVersion} mono />
          <SettingsRow label="iOS build" value={iosBuildNumber} />
          <SettingsRow label="Android versionCode" value={String(androidVersionCode)} last />
        </SettingsSection>

        <SettingsSection title="Thiết bị">
          <SettingsRow label="Device ID" value={deviceId ?? 'Đang tải…'} mono last />
        </SettingsSection>

        <SettingsSection title="Cấu hình (developer)">
          <View style={styles.noteBlock}>
            <Text style={[styles.note, { color: colors.text.secondary }]}>
              URL và API key được gắn lúc build qua file env — không đổi trực tiếp trong app (bảo mật).
            </Text>
            <Text style={[styles.bullet, { color: colors.text.primary }]}>• Dev: apps/mobile/.env.development</Text>
            <Text style={[styles.bullet, { color: colors.text.primary }]}>• Prod: apps/mobile/.env.production</Text>
            <Text style={[styles.bullet, { color: colors.text.primary }]}>
              • Schema DB: supabase/apply-all.sql hoặc npm run db:push
            </Text>
            <Text style={[styles.bullet, { color: colors.text.primary }]}>
              • Bật Anonymous sign-ins trên Supabase Dashboard
            </Text>
            <Text style={[styles.note, { color: colors.text.tertiary, marginTop: 8 }]}>
              Chi tiết: apps/mobile/ENVIRONMENT.md
            </Text>
          </View>
        </SettingsSection>
      </ScrollView>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  themeRow: { flexDirection: 'row', gap: 8, paddingVertical: 12 },
  themeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  soundLabelWrap: { flex: 1, paddingRight: 12 },
  soundLabel: { fontSize: 15, fontWeight: '600' },
  soundHint: { fontSize: 12, marginTop: 2 },
  previewRow: { flexDirection: 'row', gap: 8, paddingVertical: 12 },
  previewBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  noteBlock: { paddingVertical: 12 },
  note: { fontSize: 13, lineHeight: 20, marginBottom: 8 },
  bullet: { fontSize: 13, lineHeight: 22 },
});
