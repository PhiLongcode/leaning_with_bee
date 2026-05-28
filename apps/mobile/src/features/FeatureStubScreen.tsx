import { StyleSheet, Text, View } from 'react-native';
import { FeatureShell } from '../components/FeatureShell';
import { useTheme } from '../theme/ThemeContext';
import type { FeatureMeta } from '../navigation/screens';

type Props = Pick<FeatureMeta, 'title' | 'req' | 'description'>;

export function FeatureStubScreen({ title, req, description }: Props) {
  const { colors } = useTheme();

  return (
    <FeatureShell title={title} req={req}>
      <View style={[styles.card, { backgroundColor: colors.background.secondary, borderColor: colors.border.tertiary }]}>
        <Text style={{ color: colors.text.secondary, fontSize: 14, lineHeight: 22 }}>{description}</Text>
        <Text style={[styles.badge, { color: colors.text.tertiary, marginTop: 16 }]}>
          Module domain đã scaffold trong src/ — UI sẽ triển khai theo dev plan.
        </Text>
      </View>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  badge: { fontSize: 12, fontStyle: 'italic' },
});
