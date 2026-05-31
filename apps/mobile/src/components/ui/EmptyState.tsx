import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../PrimaryButton';
import { useTheme } from '../../theme/ThemeContext';
import { AppIcon } from './AppIcon';

type Props = {
  message?: string;
  onRetry?: () => void;
};

export function EmptyState({ message = 'Chưa có dữ liệu!', onRetry }: Props) {
  const { colors, tokens } = useTheme();

  return (
    <View style={styles.wrap}>
      <AppIcon name="collection" size={48} color={colors.text.inactive} />
      <Text style={[tokens.typography.body, { color: colors.text.secondary, marginTop: 16, textAlign: 'center' }]}>
        {message}
      </Text>
      {onRetry ? (
        <View style={styles.cta}>
          <PrimaryButton title="Thử lại" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  cta: { marginTop: 24, width: '100%', maxWidth: 200 },
});
