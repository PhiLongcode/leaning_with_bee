import {
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
} from '@expo-google-fonts/be-vietnam-pro';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, useFonts } from '@expo-google-fonts/nunito';
import type { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { brand } from '../theme/colors';

type Props = { children: ReactNode };

export function FontProvider({ children }: Props) {
  const [loaded] = useFonts({
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FA' }}>
        <ActivityIndicator size="large" color={brand.primary} />
      </View>
    );
  }

  return <>{children}</>;
}
