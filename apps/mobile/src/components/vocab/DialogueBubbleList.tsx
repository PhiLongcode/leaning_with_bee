import { Text, View, StyleSheet } from 'react-native';
import type { VocabularyDialogue } from '@hoc-cung-bee/features';
import { Chip } from '../ui/Chip';
import { useTheme } from '../../theme/ThemeContext';

type Props = {
  dialogue: VocabularyDialogue;
  highlightWord?: string;
};

function highlightText(text: string, word?: string, accent?: string) {
  if (!word?.trim()) return <Text>{text}</Text>;
  const re = new RegExp(`(\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b)`, 'gi');
  const parts = text.split(re);
  return (
    <Text>
      {parts.map((part, i) =>
        re.test(part) ? (
          <Text key={i} style={{ fontWeight: '800', color: accent }}>
            {part}
          </Text>
        ) : (
          <Text key={i}>{part}</Text>
        ),
      )}
    </Text>
  );
}

export function DialogueBubbleList({ dialogue, highlightWord }: Props) {
  const { colors, brand } = useTheme();

  return (
    <View style={styles.wrap} testID="dialogue-bubble-list">
      {dialogue.scenario ? (
        <Text style={[styles.scenario, { color: colors.text.tertiary }]}>{dialogue.scenario}</Text>
      ) : null}
      {dialogue.lines.map((line, idx) => (
        <View key={`${line.speaker}-${idx}`} style={styles.row} testID={`dialogue-line-${idx}`}>
          <Chip label={line.speaker} tone="info" />
          <View style={[styles.bubble, { backgroundColor: colors.background.secondary }]}>
            <Text style={{ color: colors.text.primary, lineHeight: 22 }}>
              {highlightText(line.text, highlightWord, brand.primary)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  scenario: { fontSize: 12, fontStyle: 'italic', marginBottom: 4 },
  row: { gap: 6 },
  bubble: { padding: 12, borderRadius: 12 },
});
