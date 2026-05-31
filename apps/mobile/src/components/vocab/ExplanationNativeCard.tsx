import { Text, View, StyleSheet } from 'react-native';
import type { ExplanationNative } from '@hoc-cung-bee/features';
import { getNativeLanguageLabel, type NativeLanguageCode } from '../../store/localeStore';
import { Card } from '../ui/Card';
import { useTheme } from '../../theme/ThemeContext';

type Props = {
  explanation: ExplanationNative;
};

export function ExplanationNativeCard({ explanation }: Props) {
  const { colors } = useTheme();
  const lang = explanation.language as NativeLanguageCode;
  const title = getNativeLanguageLabel(lang) ?? explanation.language;

  return (
    <Card style={styles.card} testID="explanation-native-card">
      <Text style={[styles.label, { color: colors.surface.infoText }]}>
        Giải thích ({title})
      </Text>
      <Text style={[styles.body, { color: colors.text.primary }]}>{explanation.summary}</Text>
      <Text style={[styles.sub, { color: colors.text.secondary, marginTop: 8 }]}>
        {explanation.usageInContext}
      </Text>
      {explanation.grammarNotes ? (
        <Text style={[styles.note, { color: colors.text.tertiary, marginTop: 8 }]}>
          {explanation.grammarNotes}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  label: { fontSize: 11, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
  sub: { fontSize: 14, lineHeight: 20 },
  note: { fontSize: 13, lineHeight: 18, fontStyle: 'italic' },
});
