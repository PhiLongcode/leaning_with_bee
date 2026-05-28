import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getOrCreateDeviceId } from './lib/deviceId';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { AppNavigator } from './navigation/AppNavigator';
import { useAppStore } from './store/appStore';
import { ThemeProvider, useTheme } from './theme/ThemeContext';

function AppContent() {
  const setDeviceId = useAppStore((s) => s.setDeviceId);
  const { isDark } = useTheme();

  useEffect(() => {
    (async () => {
      const deviceId = await getOrCreateDeviceId();
      setDeviceId(deviceId);
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) console.warn('Anonymous auth:', error.message);
      }
    })();
  }, [setDeviceId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
