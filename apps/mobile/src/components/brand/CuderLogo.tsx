import { ActivityIndicator, Image, StyleSheet, Text, View, type ImageStyle, type StyleProp } from 'react-native';
import { useBrandRuntime } from '../../store/brandStore';

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
 * Logo app — URI từ `app_brand_config` (Supabase) + cache local.
 * Không hardcode file ảnh trong component.
 */
export function CuderLogo({ size = 'lg', style }: Props) {
  const brand = useBrandRuntime();
  const dim = typeof size === 'number' ? size : SIZES[size];
  const uri = brand.resolvedLogoUrl;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[{ width: dim, height: dim, resizeMode: 'contain' }, style]}
        accessibilityLabel={`${brand.brandName} logo`}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { width: dim, height: dim, borderRadius: dim / 8 },
        style,
      ]}
      accessibilityLabel={`${brand.brandName} logo placeholder`}
    >
      <Text style={[styles.initial, { fontSize: dim * 0.28 }]}>
        {brand.brandName.trim().charAt(0).toUpperCase() || '?'}
      </Text>
    </View>
  );
}

/** @deprecated Dùng CuderLogo */
export const BeeLogo = CuderLogo;

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
  },
  initial: {
    fontWeight: '700',
    color: '#27AE60',
  },
});

/** Hiển thị khi đang tải brand lần đầu */
export function BrandLogoLoader({ size = 'hero' as SizePreset }) {
  const dim = SIZES[size];
  return (
    <View style={{ width: dim, height: dim, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#27AE60" />
    </View>
  );
}
