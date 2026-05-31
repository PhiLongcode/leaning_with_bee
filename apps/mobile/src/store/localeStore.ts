import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  isNativeLanguageCode,
  NATIVE_LANGUAGE_LABELS,
  type NativeLanguageCode,
} from '@hoc-cung-bee/features';
import { create } from 'zustand';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const CACHE_KEY = '@cuder/native_language_v1';

type LocaleState = {
  nativeLanguage: NativeLanguageCode;
  loading: boolean;
  setNativeLanguage: (code: NativeLanguageCode) => Promise<void>;
  hydrate: () => Promise<void>;
};

export function getNativeLanguageLabel(code: NativeLanguageCode): string {
  return NATIVE_LANGUAGE_LABELS[code];
}

export const useLocaleStore = create<LocaleState>((set, get) => ({
  nativeLanguage: 'vi',
  loading: true,
  hydrate: async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached && isNativeLanguageCode(cached)) {
        set({ nativeLanguage: cached, loading: false });
        return;
      }
    } catch {
      /* ignore */
    }
    set({ loading: false });
  },
  setNativeLanguage: async (code) => {
    set({ nativeLanguage: code });
    await AsyncStorage.setItem(CACHE_KEY, code);
    if (!isSupabaseConfigured) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').update({ native_language: code }).eq('id', user.id);
  },
}));

export function useNativeLanguage(): NativeLanguageCode {
  return useLocaleStore((s) => s.nativeLanguage);
}
