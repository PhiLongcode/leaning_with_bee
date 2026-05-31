import { Text, type TextProps, type TextStyle } from 'react-native';
import type { TypographyTokens } from '../../theme/typographyStyles';
import { useTheme } from '../../theme/ThemeContext';

type Props = TextProps & {
  variant?: keyof TypographyTokens;
};

/** Text dùng token typography + Nunito (ưu tiên thay `Text` + fontSize tự do) */
export function AppText({ variant = 'body', style, ...rest }: Props) {
  const { tokens } = useTheme();
  return <Text style={[tokens.typography[variant], style as TextStyle]} {...rest} />;
}
