import { StyleSheet, Text, View } from 'react-native';
import { AppPressable } from './AppPressable';
import { AppIcon } from './AppIcon';
import { useTheme } from '../../theme/ThemeContext';

type Props = {
  word: string;
  meaning: string;
  partOfSpeech?: string | null;
  onPress?: () => void;
  onSave?: () => void;
};

export function VocabListItem({ word, meaning, partOfSpeech, onPress, onSave }: Props) {
  const { brand, colors, tokens } = useTheme();

  return (
    <AppPressable
      feedback="opacity"
      onPress={onPress}
      style={[styles.row, { borderBottomColor: colors.border.tertiary }]}
      disabled={!onPress}
    >
      <View style={[styles.iconCircle, { borderColor: brand.primaryLight }]}>
        <AppIcon name="vocabulary" size={16} color={brand.primary} />
      </View>
      <View style={styles.center}>
        <Text style={[tokens.typography.heading3, { color: brand.primary }]}>{word}</Text>
        <Text style={[tokens.typography.caption, { color: colors.text.secondary, marginTop: 2 }]}>
          {partOfSpeech ? `${partOfSpeech} · ` : ''}
          {meaning}
        </Text>
      </View>
      {onSave ? (
        <AppPressable feedback="icon" onPress={onSave} hitSlop={8}>
          <AppIcon name="collection" size={20} color={colors.text.primary} />
        </AppPressable>
      ) : null}
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1 },
});
