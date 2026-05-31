import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { isSupabaseConfigured } from './config/env';
import { getOrCreateDeviceId } from './lib/deviceId';
import { ensureProfile } from './lib/ensureProfile';
import { refreshDatabaseStatus } from './lib/refreshDatabaseStatus';
import { getDashboardStats } from '@hoc-cung-bee/features';
import { getDashboardRepository } from './lib/featureRepos';
import { fetchBrandConfig, loadCachedBrandConfig } from './lib/brandConfigLoader';
import { fetchSystemConfig, loadCachedSystemConfig } from './lib/systemConfigLoader';
import { supabase } from './lib/supabase';
import { AppNavigator } from './navigation/AppNavigator';
import { applyE2eBootstrapWeb } from './lib/e2eBootstrap.web';
import { attachNotificationOpenHandler, bootstrapReminderNotifications } from './lib/reminderBootstrap';
import { useAppStore } from './store/appStore';
import { useBrandStore } from './store/brandStore';
import { usePermissionsStore } from './store/permissionsStore';
import { useLocaleStore } from './store/localeStore';
import { AppShell } from './components/ui/AppShell';
import { FontProvider } from './providers/FontProvider';
import { ThemeProvider, useTheme } from './theme/ThemeContext';

function AppContent() {
  const setDeviceId = useAppStore((s) => s.setDeviceId);
  const setScreen = useAppStore((s) => s.setScreen);
  const applyGamification = useAppStore((s) => s.applyGamification);
  const setBrand = useBrandStore((s) => s.setBrand);
  const setPermissions = usePermissionsStore((s) => s.setPermissions);
  const hydrateLocale = useLocaleStore((s) => s.hydrate);
  const { isDark, colors } = useTheme();

  useEffect(() => {
    applyE2eBootstrapWeb();
  }, []);

  useEffect(() => {
    return attachNotificationOpenHandler(setScreen);
  }, [setScreen]);

  useEffect(() => {
    void hydrateLocale();
  }, [hydrateLocale]);

  useEffect(() => {
    (async () => {
      const [cachedBrand, cachedPermissions] = await Promise.all([
        loadCachedBrandConfig(),
        loadCachedSystemConfig(),
      ]);
      if (cachedBrand) setBrand(cachedBrand);
      if (cachedPermissions) setPermissions(cachedPermissions.permissions);

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

      const [brand, systemConfig] = await Promise.all([
        fetchBrandConfig(),
        fetchSystemConfig(),
      ]);
      setBrand(brand);
      setPermissions(systemConfig.permissions);

      await refreshDatabaseStatus();
      const dash = await getDashboardStats(getDashboardRepository(), deviceId);
      if (dash.ok) applyGamification({ streak: dash.value.streak, xp: dash.value.xp });

      await bootstrapReminderNotifications(deviceId);
    })();
  }, [setDeviceId, applyGamification, setBrand, setPermissions]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppShell>
        <AppNavigator />
      </AppShell>
    </SafeAreaView>
  );
}

export function AppRoot() {
  return (
    <SafeAreaProvider>
      <FontProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </FontProvider>
    </SafeAreaProvider>
  );
}
