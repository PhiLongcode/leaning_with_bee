import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  title: string;
  children: ReactNode;
};

export function SettingsSection({ title, children }: Props) {
  const { colors, tokens, isDark } = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: colors.text.tertiary }, tokens.typography.label]}>{title}</Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.background.elevated,
            borderColor: colors.border.tertiary,
          },
          !isDark && tokens.shadow.card,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

type RowProps = {
  label: string;
  value: string;
  mono?: boolean;
  last?: boolean;
};

export function SettingsRow({ label, value, mono, last }: RowProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.row,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border.tertiary },
      ]}
    >
      <Text style={[styles.label, { color: colors.text.secondary }]}>{label}</Text>
      <Text
        style={[styles.value, { color: colors.text.primary }, mono && styles.mono]}
        selectable
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  title: { marginBottom: 8 },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  row: { paddingVertical: 12 },
  label: { fontSize: 12, marginBottom: 4, fontWeight: '500' },
  value: { fontSize: 15, fontWeight: '600' },
  mono: { fontFamily: 'monospace', fontSize: 13, fontWeight: '500' },
});
