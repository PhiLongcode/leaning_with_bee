import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { AppPressable } from '../components/ui/AppPressable';
import {
  NATIVE_LANGUAGE_LABELS,
  SUPPORTED_NATIVE_LANGUAGES,
} from '@hoc-cung-bee/features';
import { CuderLogo } from '../components/brand/CuderLogo';
import { DatabaseStatusCard } from '../components/DatabaseStatusCard';
import { GreenScreenLayout } from '../components/ui/GreenScreenLayout';
import { SettingsListRow } from '../components/ui/SettingsListRow';
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

function themeModeLabel(mode: ThemeMode): string {
  if (mode === 'light') return 'Chế độ sáng';
  if (mode === 'dark') return 'Chế độ tối';
  return 'Theo hệ thống';
}

export function SettingsScreen() {
  const { colors, mode, setMode, brand: brandColors, tokens } = useTheme();
  const setScreen = useAppStore((s) => s.setScreen);
  const deviceId = useAppStore((s) => s.deviceId);
  const dbConnection = useAppStore((s) => s.dbConnection);
  const dbChecking = useAppStore((s) => s.dbChecking);
  const [studySfxEnabled, setStudySfxEnabled] = useState(getSoundSettings().studySfxEnabled);
  const [reminderSfxEnabled, setReminderSfxEnabled] = useState(getSoundSettings().reminderSfxEnabled);
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [developerOpen, setDeveloperOpen] = useState(false);
  const nativeLanguage = useNativeLanguage();
  const setNativeLanguage = useLocaleStore((s) => s.setNativeLanguage);

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
    <GreenScreenLayout
      title="Cài đặt"
      onBack={() => setScreen('fn10_dashboard')}
      headerColor="part"
      sheetVariant="page"
      titleAlign="center"
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <SettingsSection title="Tài khoản">
          <SettingsListRow
            left={
              <View style={[styles.avatar, { backgroundColor: brandColors.primaryLight }]}>
                <CuderLogo size="sm" />
              </View>
            }
            title="Nguyễn Phi Long"
            subtitle="Xem thông tin"
            onPress={() => setScreen('fn10_dashboard')}
            last
          />
        </SettingsSection>

        <SettingsSection title="Giao diện">
          <SettingsListRow
            icon="sun"
            title="Giao diện"
            value={themeModeLabel(mode)}
            onPress={() => {
              setThemePickerOpen((v) => !v);
              setLangPickerOpen(false);
            }}
            last={!themePickerOpen && !langPickerOpen}
          />
          {themePickerOpen ? (
            <View style={[styles.inlinePanel, { borderTopColor: colors.border.tertiary }]}>
              <View style={styles.themeRow}>
                {THEME_OPTIONS.map((opt) => {
                  const active = mode === opt.mode;
                  return (
                    <AppPressable
                      key={opt.mode}
                      feedback="chip"
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
                    </AppPressable>
                  );
                })}
              </View>
            </View>
          ) : null}
          <SettingsListRow
            icon="vocabulary"
            title="Ngôn ngữ mẹ đẻ của bạn"
            value={getNativeLanguageLabel(nativeLanguage)}
            onPress={() => {
              setLangPickerOpen((v) => !v);
              setThemePickerOpen(false);
            }}
            last={!langPickerOpen}
          />
          {langPickerOpen
            ? SUPPORTED_NATIVE_LANGUAGES.map((code, i) => (
                <SettingsListRow
                  key={code}
                  title={NATIVE_LANGUAGE_LABELS[code]}
                  value={nativeLanguage === code ? '✓' : undefined}
                  onPress={() => {
                    void setNativeLanguage(code);
                    setLangPickerOpen(false);
                  }}
                  last={i === SUPPORTED_NATIVE_LANGUAGES.length - 1}
                />
              ))
            : null}
        </SettingsSection>

        <SettingsSection title="Thông báo">
          <SettingsListRow
            icon="bell"
            title="Nhắc nhở luyện tập hằng ngày"
            value="Chưa thiết lập"
            onPress={() => setScreen('fn11_notifications')}
            last
          />
        </SettingsSection>

        <SettingsSection title="Luyện tập">
          <SettingsListRow
            icon="dumbbell"
            title="Cấu hình luyện tập"
            onPress={() => setPracticeOpen((v) => !v)}
            last={!practiceOpen}
          />
          {practiceOpen ? (
            <View style={[styles.inlinePanel, { borderTopColor: colors.border.tertiary }]}>
              <View style={[styles.soundRow, { borderBottomColor: colors.border.tertiary }]}>
                <View style={styles.soundLabelWrap}>
                  <Text style={[tokens.typography.bodyMedium, { color: colors.text.primary, fontWeight: '600' }]}>
                    Âm thanh học tập
                  </Text>
                  <Text style={[tokens.typography.caption, { color: colors.text.secondary, marginTop: 2 }]}>
                    Đúng / sai khi chọn đáp án
                  </Text>
                </View>
                <Switch
                  value={studySfxEnabled}
                  onValueChange={updateStudySfx}
                  trackColor={{ false: colors.border.primary, true: brandColors.primary }}
                />
              </View>
              <View style={[styles.soundRow, { borderBottomColor: colors.border.tertiary }]}>
                <View style={styles.soundLabelWrap}>
                  <Text style={[tokens.typography.bodyMedium, { color: colors.text.primary, fontWeight: '600' }]}>
                    Âm thanh nhắc nhở
                  </Text>
                  <Text style={[tokens.typography.caption, { color: colors.text.secondary, marginTop: 2 }]}>
                    Khi mở thông báo nhắc học
                  </Text>
                </View>
                <Switch
                  value={reminderSfxEnabled}
                  onValueChange={updateReminderSfx}
                  trackColor={{ false: colors.border.primary, true: brandColors.primary }}
                />
              </View>
              <View style={styles.previewRow}>
                <AppPressable
                  feedback="chip"
                  style={[styles.previewBtn, { backgroundColor: colors.surface.success }]}
                  onPress={() => void playAnswerCorrect()}
                >
                  <Text style={{ color: colors.surface.successText, fontWeight: '600', fontSize: 13 }}>Nghe đúng</Text>
                </AppPressable>
                <AppPressable
                  feedback="chip"
                  style={[styles.previewBtn, { backgroundColor: colors.surface.accent }]}
                  onPress={() => void playAnswerWrong()}
                >
                  <Text style={{ color: colors.surface.accentText, fontWeight: '600', fontSize: 13 }}>Nghe sai</Text>
                </AppPressable>
                <AppPressable
                  feedback="chip"
                  style={[styles.previewBtn, { backgroundColor: colors.surface.info }]}
                  onPress={() => void playReminder('default')}
                >
                  <Text style={{ color: colors.surface.infoText, fontWeight: '600', fontSize: 13 }}>Nghe nhắc</Text>
                </AppPressable>
              </View>
            </View>
          ) : null}
        </SettingsSection>

        <AppPressable
          feedback="opacity"
          onPress={() => setDeveloperOpen((v) => !v)}
          style={[styles.devToggle, { borderColor: colors.border.tertiary }]}
        >
          <Text style={[tokens.typography.captionBold, { color: colors.text.tertiary }]}>
            {developerOpen ? '▾ Ẩn thông tin kỹ thuật' : '▸ Thông tin kỹ thuật'}
          </Text>
        </AppPressable>

        {developerOpen ? (
          <>
            <DatabaseStatusCard
              state={dbConnection}
              configOk={isSupabaseConfigured}
              onRefresh={() => void refreshDatabaseStatus()}
              refreshing={dbChecking}
            />

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

            <SettingsSection title="Cấu hình build">
              <View style={styles.noteBlock}>
                <Text style={[tokens.typography.caption, { color: colors.text.secondary, lineHeight: 20 }]}>
                  URL và API key được gắn lúc build qua file env — không đổi trực tiếp trong app.
                </Text>
                <Text style={[tokens.typography.caption, { color: colors.text.primary, marginTop: 8 }]}>
                  • Dev: apps/mobile/.env.development
                </Text>
                <Text style={[tokens.typography.caption, { color: colors.text.primary }]}>
                  • Prod: apps/mobile/.env.production
                </Text>
              </View>
            </SettingsSection>
          </>
        ) : null}
      </ScrollView>
    </GreenScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  inlinePanel: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 4,
    paddingBottom: 8,
  },
  themeRow: { flexDirection: 'row', gap: 8, paddingVertical: 12, paddingHorizontal: 4 },
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
  previewRow: { flexDirection: 'row', gap: 8, paddingVertical: 12, paddingHorizontal: 4 },
  previewBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  devToggle: {
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    alignItems: 'center',
  },
  noteBlock: { paddingVertical: 12 },
});
