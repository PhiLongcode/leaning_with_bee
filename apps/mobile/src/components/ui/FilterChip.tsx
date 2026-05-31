import { StyleSheet, Text } from 'react-native';
import { AppPressable } from './AppPressable';
import { useTheme } from '../../theme/ThemeContext';

type Props = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

export function FilterChip({ label, active, onPress }: Props) {
  const { brand, tokens, isDark, colors } = useTheme();
  const inactiveBg = isDark ? colors.background.secondary : brand.primaryLight;
  const inactiveText = isDark ? colors.text.secondary : brand.primaryText;

  return (
    <AppPressable
      feedback="chip"
      rippleColor={active ? 'rgba(255,255,255,0.3)' : 'rgba(39,174,96,0.15)'}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? brand.primary : inactiveBg,
        },
      ]}
    >
      <Text
        style={[
          tokens.typography.captionBold,
          { color: active ? '#FFFFFF' : inactiveText },
        ]}
      >
        {label}
      </Text>
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
});
