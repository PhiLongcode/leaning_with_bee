import type { ComponentType } from 'react';
import { useEffect } from 'react';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { UserVocabularyScreen } from '../features/fn02/UserVocabularyScreen';
import { SentencesScreen } from '../features/fn03/SentencesScreen';
import { CollectionScreen } from '../features/fn04/CollectionScreen';
import { SpacedRepetitionScreen } from '../features/fn05/SpacedRepetitionScreen';
import { ContextReviewScreen } from '../features/fn06/ContextReviewScreen';
import { AiChatScreen } from '../features/fn07/AiChatScreen';
import { SpeakingScreen } from '../features/fn08/SpeakingScreen';
import { DashboardScreen } from '../features/fn10/DashboardScreen';
import { NotificationsScreen } from '../features/fn11/NotificationsScreen';
import { VocabularyLearningScreen } from '../features/fn01/VocabularyLearningScreen';
import { useAppStore } from '../store/appStore';
import { useAppPermissions } from '../store/permissionsStore';
import { isScreenAllowed } from '../lib/featurePermissions';
import type { Screen } from './screens';

const SCREEN_MAP: Partial<Record<Screen, ComponentType>> = {
  splash: SplashScreen,
  home: HomeScreen,
  settings: SettingsScreen,
  fn01_vocabulary: VocabularyLearningScreen,
  fn02_vocab_manage: UserVocabularyScreen,
  fn03_sentences: SentencesScreen,
  fn04_collection: CollectionScreen,
  fn05_spaced_repetition: SpacedRepetitionScreen,
  fn06_context_review: ContextReviewScreen,
  fn07_ai_chat: AiChatScreen,
  fn08_speaking: SpeakingScreen,
  fn09_pronunciation: SpeakingScreen,
  fn10_dashboard: DashboardScreen,
  fn11_notifications: NotificationsScreen,
};

export function AppNavigator() {
  const screen = useAppStore((s) => s.screen);
  const setScreen = useAppStore((s) => s.setScreen);
  const permissions = useAppPermissions();

  useEffect(() => {
    if (!isScreenAllowed(screen, permissions)) {
      setScreen('home');
    }
  }, [screen, permissions, setScreen]);

  const resolved: Screen = isScreenAllowed(screen, permissions) ? screen : 'home';
  const Component = SCREEN_MAP[resolved] ?? HomeScreen;
  return <Component />;
}
