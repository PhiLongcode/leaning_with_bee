import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppPressable } from './ui/AppPressable';
import { FONT_FAMILY } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  title: string;
  children: ReactNode;
};

export function SettingsSection({ title, children }: Props) {
  const { colors, tokens, isDark, cardBg } = useTheme();
  return (
    <View style={styles.wrap}>
      {title ? (
        <Text style={[styles.sectionTitle, tokens.typography.heading1, { color: colors.text.primary }]}>
          {title}
        </Text>
      ) : null}
      <View
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
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
  onPress?: () => void;
};

export function SettingsRow({ label, value, mono, last, onPress }: RowProps) {
  const { colors, tokens } = useTheme();
  const content = (
    <>
      <Text style={[tokens.typography.caption, styles.label, { color: colors.text.secondary }]}>{label}</Text>
      <Text
        style={[
          mono ? styles.mono : tokens.typography.bodyMedium,
          { color: colors.text.primary },
        ]}
        selectable
      >
        {value}
      </Text>
    </>
  );
  return (
    <View
      style={[
        styles.row,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border.tertiary },
      ]}
    >
      {onPress ? (
        <AppPressable feedback="opacity" onPress={onPress} accessibilityRole="button">
          {content}
        </AppPressable>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  sectionTitle: { marginBottom: 8, marginTop: 4 },
  card: {
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  row: { paddingVertical: 12 },
  label: { marginBottom: 4 },
  mono: { fontFamily: FONT_FAMILY.mono, fontSize: 13, lineHeight: 18 },
});
