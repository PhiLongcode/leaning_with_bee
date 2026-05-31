import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { HeaderGreenColor } from './ui/HeaderGreen';
import { GreenScreenLayout } from './ui/GreenScreenLayout';
import { HeaderPlain } from './ui/HeaderPlain';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  title: string;
  req?: string;
  children: ReactNode;
  variant?: 'plain' | 'green';
  /** Green header: `part` (#1B8E3D) or `brand` (#27AE60) */
  headerColor?: HeaderGreenColor;
};

export function FeatureShell({
  title,
  req,
  children,
  variant = 'plain',
  headerColor = 'part',
}: Props) {
  const { pageBg } = useTheme();
  const setScreen = useAppStore((s) => s.setScreen);

  if (variant === 'green') {
    return (
      <GreenScreenLayout
        title={title}
        onBack={() => setScreen('home')}
        headerColor={headerColor}
      >
        <View style={styles.greenBody}>{children}</View>
      </GreenScreenLayout>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: pageBg }]}>
      <HeaderPlain title={title} onBack={() => setScreen('home')} />
      {req ? <View style={styles.reqWrap} /> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  reqWrap: { height: 0 },
  body: { flex: 1, paddingHorizontal: 20 },
  greenBody: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
});
