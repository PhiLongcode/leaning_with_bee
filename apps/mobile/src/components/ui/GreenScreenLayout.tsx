import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { HeaderGreenColor } from './HeaderGreen';
import { HeaderGreen } from './HeaderGreen';
import { useTheme } from '../../theme/ThemeContext';

type Props = {
  title: string;
  onBack?: () => void;
  headerColor?: HeaderGreenColor;
  right?: ReactNode;
  children: ReactNode;
  /** Bottom padding inside sheet (fixed CTA bars) */
  sheetPaddingBottom?: number;
  /** `page` = nền xám + card trắng (Settings mockup); `card` = sheet trắng full */
  sheetVariant?: 'card' | 'page';
  titleAlign?: 'left' | 'center';
};

/**
 * Green header + white/card content sheet overlap (mockup Part 1 / Vocab §4.4.2–4.4.3).
 * Solid header color only — no gradient.
 */
export function GreenScreenLayout({
  title,
  onBack,
  headerColor = 'part',
  right,
  children,
  sheetPaddingBottom = 0,
  sheetVariant = 'card',
  titleAlign = 'left',
}: Props) {
  const { pageAltBg, cardBg } = useTheme();
  const sheetBg = sheetVariant === 'page' ? pageAltBg : cardBg;

  return (
    <View style={[styles.root, { backgroundColor: pageAltBg }]}>
      <HeaderGreen
        title={title}
        onBack={onBack}
        headerColor={headerColor}
        right={right}
        titleAlign={titleAlign}
      />
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: sheetBg,
            paddingBottom: sheetPaddingBottom,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  sheet: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
});
