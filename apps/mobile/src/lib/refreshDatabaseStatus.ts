import { env } from '../config/env';
import { checkDatabaseConnection } from './checkDatabaseConnection';
import { supabase } from './supabase';
import { useAppStore } from '../store/appStore';

export async function refreshDatabaseStatus(): Promise<void> {
  const { setDbChecking, setDbConnection } = useAppStore.getState();
  setDbChecking(true);
  setDbConnection({
    ...(await checkDatabaseConnection(supabase, env.projectRef)),
  });
  setDbChecking(false);
}
