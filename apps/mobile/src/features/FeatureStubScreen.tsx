import { StyleSheet, Text, View } from 'react-native';
import { FeatureShell } from '../components/FeatureShell';
import { AppIcon } from '../components/ui/AppIcon';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { useTheme } from '../theme/ThemeContext';
import type { FeatureMeta } from '../navigation/screens';

type Props = Pick<FeatureMeta, 'title' | 'req' | 'description'>;

export function FeatureStubScreen({ title, req, description }: Props) {
  const { colors, tokens } = useTheme();

  return (
    <FeatureShell title={title} req={req}>
      <View style={styles.wrap}>
        <View style={[styles.iconRing, { backgroundColor: colors.surface.accent }]}>
          <AppIcon name="construction" size={32} color={colors.surface.accentText} />
        </View>
        <Chip label="ĐANG PHÁT TRIỂN" tone="accent" style={styles.badge} />
        <Card>
          <Text style={[tokens.typography.body, { color: colors.text.primary }]}>{description}</Text>
          <Text style={[styles.hint, { color: colors.text.tertiary }]}>
            Module domain đã scaffold trong src/ — UI sẽ triển khai theo dev plan.
          </Text>
        </Card>
      </View>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 24, alignItems: 'center' },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badge: { marginBottom: 20 },
  hint: { fontSize: 12, marginTop: 16, lineHeight: 18, fontStyle: 'italic' },
});
