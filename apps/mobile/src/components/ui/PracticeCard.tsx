import { StyleSheet, Text, View } from 'react-native';
import { AppPressable } from './AppPressable';
import { useTheme } from '../../theme/ThemeContext';
import { AppIcon } from './AppIcon';
import type { AppIconName } from './icons';

type Props = {
  title: string;
  subLabel: string;
  subIcon?: AppIconName;
  onPress: () => void;
};

export function PracticeCard({ title, subLabel, subIcon = 'vocabulary', onPress }: Props) {
  const { brand, colors, tokens, cardBg, isDark } = useTheme();

  return (
    <AppPressable
      feedback="card"
      onPress={onPress}
      style={[
        styles.card,
        !isDark && tokens.shadow.card,
        { backgroundColor: cardBg, borderWidth: isDark ? 1 : 0, borderColor: colors.border.tertiary },
      ]}
    >
      <Text style={[tokens.typography.heading3, { color: colors.text.primary }]}>{title}</Text>
      <View style={[styles.subBtn, { backgroundColor: brand.mintButton }]}>
        <AppIcon name={subIcon} size={14} color={brand.primary} />
        <Text style={[tokens.typography.captionBold, { color: brand.primary, marginLeft: 6 }]}>{subLabel}</Text>
      </View>
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  subBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
});
