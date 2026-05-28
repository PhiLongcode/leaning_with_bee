import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { isSupabaseConfigured } from './config/env';
import { getOrCreateDeviceId } from './lib/deviceId';
import { ensureProfile } from './lib/ensureProfile';
import { refreshDatabaseStatus } from './lib/refreshDatabaseStatus';
import { getDashboardStats } from '@hoc-cung-bee/features';
import { getDashboardRepository } from './lib/featureRepos';
import { supabase } from './lib/supabase';
import { AppNavigator } from './navigation/AppNavigator';
import { useAppStore } from './store/appStore';
import { ThemeProvider, useTheme } from './theme/ThemeContext';

function AppContent() {
  const setDeviceId = useAppStore((s) => s.setDeviceId);
  const applyGamification = useAppStore((s) => s.applyGamification);
  const { isDark, colors } = useTheme();

  useEffect(() => {
    (async () => {
      const deviceId = await getOrCreateDeviceId();
      setDeviceId(deviceId);
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInAnonymously({
          options: { data: { device_id: deviceId } },
        });
        if (error) {
          console.warn('Anonymous auth:', error.message);
        } else {
          await ensureProfile(supabase, deviceId);
        }
      }
      await refreshDatabaseStatus();
      const dash = await getDashboardStats(getDashboardRepository(), deviceId);
      if (dash.ok) applyGamification({ streak: dash.value.streak, xp: dash.value.xp });
    })();
  }, [setDeviceId, applyGamification]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </SafeAreaView>
  );
}

export function AppRoot() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
