import {
  completeVocabularyStudyStep,
  getDashboardStats,
  recordContextQuizResult,
} from '@hoc-cung-bee/features';
import {
  getDashboardRepository,
  getLearningProgressRepository,
  getUserVocabularyRepository,
} from './featureRepos';
import { useAppStore } from '../store/appStore';

async function syncGamification(deviceId: string) {
  const stats = await getDashboardStats(getDashboardRepository(), deviceId);
  if (stats.ok) {
    useAppStore.getState().applyGamification({
      streak: stats.value.streak,
      xp: stats.value.xp,
    });
  }
}

export async function onVocabularyStepCompleted(deviceId: string, vocabId: string) {
  const result = await completeVocabularyStudyStep({
    userVocabRepo: getUserVocabularyRepository(),
    progressRepo: getLearningProgressRepository(),
    dashboardRepo: getDashboardRepository(),
    deviceId,
    vocabId,
    xpGain: 5,
  });
  if (result.ok) await syncGamification(deviceId);
  return result;
}

export async function onContextQuizAnswered(
  deviceId: string,
  vocabId: string,
  correct: boolean,
) {
  const result = await recordContextQuizResult({
    progressRepo: getLearningProgressRepository(),
    dashboardRepo: getDashboardRepository(),
    deviceId,
    vocabId,
    correct,
  });
  if (result.ok) await syncGamification(deviceId);
  return result;
}
