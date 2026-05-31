import { ActivityIndicator, Image, StyleSheet, Text, View, type ImageStyle, type StyleProp } from 'react-native';
import { useBrandRuntime } from '../../store/brandStore';
import { LOCAL_AVATAR_LOGO } from './brandAssets';

const SIZES = {
  sm: 28,
  md: 36,
  lg: 52,
  hero: 120,
} as const;

type SizePreset = keyof typeof SIZES;

type Props = {
  size?: SizePreset | number;
  style?: StyleProp<ImageStyle>;
};

/**
 * Logo / mascot Cuder — `brand/logo/AvataApp.png`.
 * Ưu tiên bundle local; nếu admin cấu hình URL Supabase hợp lệ thì dùng remote.
 */
export function CuderLogo({ size = 'lg', style }: Props) {
  const brand = useBrandRuntime();
  const dim = typeof size === 'number' ? size : SIZES[size];
  const remoteUri = brand.resolvedLogoUrl?.trim();
  const source = remoteUri ? { uri: remoteUri } : LOCAL_AVATAR_LOGO;

  return (
    <Image
      source={source}
      defaultSource={LOCAL_AVATAR_LOGO}
      style={[{ width: dim, height: dim, resizeMode: 'contain' }, style]}
      accessibilityLabel={`${brand.brandName} logo`}
    />
  );
}

/** @deprecated Dùng CuderLogo */
export const BeeLogo = CuderLogo;

/** Hiển thị khi đang tải brand lần đầu */
export function BrandLogoLoader({ size = 'hero' as SizePreset }) {
  const dim = SIZES[size];
  return (
    <View style={{ width: dim, height: dim, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#27AE60" />
    </View>
  );
}
