import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  androidRipple,
  pressButton,
  pressCard,
  pressChip,
  pressIcon,
  pressOpacity,
  pressTab,
} from '../../theme/pressFeedback';

export type PressFeedback = 'button' | 'card' | 'chip' | 'tab' | 'icon' | 'opacity' | 'none';

export type AppPressableProps = PressableProps & {
  feedback?: PressFeedback;
  rippleColor?: string;
};

function feedbackStyle(feedback: PressFeedback, pressed: boolean, disabled?: boolean | null): ViewStyle {
  const off = !!disabled;
  switch (feedback) {
    case 'button':
      return pressButton(pressed, off);
    case 'card':
      return pressCard(pressed, off);
    case 'chip':
      return pressChip(pressed, off);
    case 'tab':
      return pressTab(pressed, off);
    case 'icon':
      return pressIcon(pressed, off);
    case 'opacity':
      return pressOpacity(pressed, off);
    case 'none':
    default:
      return {};
  }
}

export function AppPressable({
  feedback = 'opacity',
  rippleColor,
  style,
  disabled,
  android_ripple,
  ...rest
}: AppPressableProps) {
  const ripple =
    android_ripple ??
    (feedback !== 'none' ? androidRipple(rippleColor ?? 'rgba(0,0,0,0.12)') : undefined);

  return (
    <Pressable
      disabled={disabled}
      android_ripple={ripple}
      style={(state) => {
        const base: StyleProp<ViewStyle> =
          typeof style === 'function' ? style(state) : style;
        return [base, feedbackStyle(feedback, state.pressed, disabled)];
      }}
      {...rest}
    />
  );
}
