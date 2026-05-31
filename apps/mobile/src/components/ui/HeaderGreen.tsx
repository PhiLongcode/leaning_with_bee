import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppPressable } from './AppPressable';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { AppIcon } from './AppIcon';

/** Part detail & menu screens — solid #1B8E3D, no gradient (UX §4.4.2) */
export type HeaderGreenColor = 'part' | 'brand';

type Props = {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  footer?: ReactNode;
  /** `part` = primaryDark (Part 1, Settings, …); `brand` = primary (Vocab topic) */
  headerColor?: HeaderGreenColor;
  /** @deprecated use headerColor */
  tone?: 'primary' | 'dark' | 'settings';
  /** @deprecated use headerColor */
  darkHeader?: boolean;
  /** Mockup Settings: title giữa header */
  titleAlign?: 'left' | 'center';
};

function resolveHeaderColor(
  headerColor: HeaderGreenColor | undefined,
  tone: Props['tone'],
  darkHeader?: boolean,
): HeaderGreenColor {
  if (headerColor) return headerColor;
  if (tone === 'settings' || tone === 'dark' || darkHeader) return 'part';
  if (tone === 'primary') return 'brand';
  return 'part';
}

export function HeaderGreen({
  title,
  onBack,
  right,
  footer,
  headerColor,
  tone,
  darkHeader,
  titleAlign = 'left',
}: Props) {
  const { brand, tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const resolved = resolveHeaderColor(headerColor, tone, darkHeader);
  const bg = resolved === 'brand' ? brand.primary : brand.primaryDark;

  return (
    <View style={[styles.wrap, { backgroundColor: bg, paddingTop: insets.top + 8 }]}>
      <StatusBar style="light" />
      <View style={styles.row}>
        {onBack ? (
          <AppPressable
            feedback="icon"
            rippleColor="rgba(255,255,255,0.35)"
            onPress={onBack}
            hitSlop={12}
            style={styles.sideSlot}
            accessibilityRole="button"
          >
            <AppIcon name="arrowLeft" size={22} color="#FFFFFF" />
          </AppPressable>
        ) : (
          <View style={styles.sideSlot} />
        )}
        <View style={[styles.titleWrap, titleAlign === 'center' && styles.titleWrapCenter]}>
          <Text
            style={[
              tokens.typography.heading1,
              styles.title,
              titleAlign === 'center' && styles.titleCenter,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
        <View style={styles.sideSlot}>{right ?? null}</View>
      </View>
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingBottom: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 44,
  },
  sideSlot: {
    width: 40,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { flex: 1, justifyContent: 'center' },
  titleWrapCenter: { alignItems: 'center' },
  title: {
    color: '#FFFFFF',
    textAlign: 'left',
  },
  titleCenter: { textAlign: 'center' },
});
