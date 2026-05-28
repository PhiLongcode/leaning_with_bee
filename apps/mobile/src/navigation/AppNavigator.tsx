import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { FeatureStubScreen } from '../features/FeatureStubScreen';
import { VocabularyLearningScreen } from '../features/fn01/VocabularyLearningScreen';
import { FEATURES } from './screens';
import { useAppStore } from '../store/appStore';
import type { Screen } from './screens';

function screenToMeta(screen: Screen) {
  return FEATURES.find((f) => f.screen === screen);
}

export function AppNavigator() {
  const screen = useAppStore((s) => s.screen);

  if (screen === 'splash') return <SplashScreen />;
  if (screen === 'home') return <HomeScreen />;
  if (screen === 'settings') return <SettingsScreen />;
  if (screen === 'fn01_vocabulary') return <VocabularyLearningScreen />;

  const meta = screenToMeta(screen);
  if (meta) {
    return (
      <FeatureStubScreen title={meta.title} req={meta.req} description={meta.description} />
    );
  }

  return <HomeScreen />;
}
