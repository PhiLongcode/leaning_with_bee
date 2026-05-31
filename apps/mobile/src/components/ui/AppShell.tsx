import type { ReactNode } from 'react';
import { View } from 'react-native';
import { showsBottomNav } from '../../navigation/tabs';
import { useAppStore } from '../../store/appStore';
import { BottomNav } from './BottomNav';

export function AppShell({ children }: { children: ReactNode }) {
  const screen = useAppStore((s) => s.screen);
  const showNav = showsBottomNav(screen);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{children}</View>
      {showNav ? <BottomNav /> : null}
    </View>
  );
}
