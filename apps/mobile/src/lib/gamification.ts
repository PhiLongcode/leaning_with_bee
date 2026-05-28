import { recordStudyActivity } from '@hoc-cung-bee/features';
import { getDashboardRepository } from './featureRepos';
import { useAppStore } from '../store/appStore';

export async function awardXp(deviceId: string, amount: number): Promise<void> {
  const result = await recordStudyActivity(getDashboardRepository(), deviceId, amount);
  if (result.ok) {
    useAppStore.getState().applyGamification({
      streak: result.value.streak,
      xp: result.value.xp,
    });
  } else {
    useAppStore.getState().addXp(amount);
  }
}
