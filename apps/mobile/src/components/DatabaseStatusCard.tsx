import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { appEnv, env, isDev } from '../config/env';
import type { DatabaseConnectionState } from '../lib/checkDatabaseConnection';
import { useTheme } from '../theme/ThemeContext';
import { Card } from './ui/Card';
import { Chip } from './ui/Chip';

type Props = {
  state: DatabaseConnectionState;
  configOk: boolean;
  onRefresh: () => void;
  refreshing: boolean;
};

const STATUS_LABEL: Record<string, string> = {
  connected: 'Đã kết nối DB',
  not_configured: 'Chưa cấu hình',
  schema_missing: 'Thiếu schema',
  unreachable: 'Không kết nối được',
  auth_error: 'Lỗi auth',
  error: 'Lỗi',
  checking: 'Đang kiểm tra…',
  unchecked: 'Chưa kiểm tra',
};

function statusTone(status: DatabaseConnectionState['status']): 'success' | 'accent' | 'default' {
  if (status === 'connected') return 'success';
  if (status === 'not_configured' || status === 'schema_missing' || status === 'unchecked') return 'accent';
  return 'default';
}

export function DatabaseStatusCard({ state, configOk, onRefresh, refreshing }: Props) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Trạng thái hệ thống</Text>
        <Chip label={appEnv.toUpperCase()} tone={isDev ? 'info' : 'accent'} />
      </View>

      <StatusLine
        ok={configOk}
        label={`Cấu hình Supabase: ${configOk ? 'OK' : 'Thiếu .env'}`}
        loading={false}
      />

      <StatusLine
        ok={state.status === 'connected'}
        label={STATUS_LABEL[state.status] ?? state.status}
        detail={state.message}
        loading={refreshing}
        tone={statusTone(state.status)}
      />

      {env.projectRef ? (
        <Text style={[styles.meta, { color: colors.text.tertiary }]}>Project: {env.projectRef}</Text>
      ) : null}

      {state.checkedAt ? (
        <Text style={[styles.meta, { color: colors.text.tertiary }]}>
          Kiểm tra lúc: {new Date(state.checkedAt).toLocaleTimeString()}
        </Text>
      ) : null}

      <Pressable
        onPress={onRefresh}
        disabled={refreshing}
        style={({ pressed }) => [
          styles.refreshBtn,
          { backgroundColor: colors.surface.success, opacity: refreshing ? 0.6 : pressed ? 0.85 : 1 },
        ]}
      >
        {refreshing ? (
          <ActivityIndicator size="small" color={colors.surface.successText} />
        ) : (
          <Text style={{ color: colors.surface.successText, fontSize: 14, fontWeight: '700' }}>
            Kiểm tra lại kết nối DB
          </Text>
        )}
      </Pressable>
    </Card>
  );
}

function StatusLine({
  ok,
  label,
  detail,
  loading,
  tone,
}: {
  ok: boolean;
  label: string;
  detail?: string;
  loading: boolean;
  tone?: 'success' | 'accent' | 'default';
}) {
  const { colors } = useTheme();
  const dotColor =
    tone === 'success' || ok
      ? colors.surface.successText
      : tone === 'accent'
        ? colors.surface.accentText
        : '#C0392B';

  return (
    <View style={styles.statusRow}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.surface.successText} style={styles.dot} />
      ) : (
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text.primary, fontSize: 14, fontWeight: '600' }}>{label}</Text>
        {detail ? (
          <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 2, lineHeight: 18 }}>
            {detail}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8 },
  title: { fontSize: 16, fontWeight: '700', flex: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
  meta: { fontSize: 11, marginTop: 2, marginBottom: 4 },
  refreshBtn: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
});
