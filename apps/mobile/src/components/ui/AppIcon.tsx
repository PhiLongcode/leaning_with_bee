import { FontAwesome6 } from '@expo/vector-icons';
import type { StyleProp, TextStyle } from 'react-native';
import { APP_ICONS, type AppIconName } from './icons';

type Props = {
  name: AppIconName;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
};

/**
 * Font Awesome 6 Solid — same family as https://fontawesome.com/icons/classic/solid/*
 */
export function AppIcon({ name, size = 20, color, style, accessibilityLabel }: Props) {
  return (
    <FontAwesome6
      name={APP_ICONS[name]}
      size={size}
      color={color}
      solid
      style={style}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
