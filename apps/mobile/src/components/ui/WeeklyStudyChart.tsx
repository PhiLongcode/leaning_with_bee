import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const;
const GOAL_MINUTES = 30;

type Props = {
  /** Phút học mỗi ngày (7 phần tử, CN → hôm nay) */
  minutesByDay: number[];
};

/**
 * Biểu đồ cột 7 ngày + đường mục tiêu (mockup Account §4.4.6) — không dùng chart lib.
 */
export function WeeklyStudyChart({ minutesByDay }: Props) {
  const { brand, colors, tokens, isDark } = useTheme();
  const values = minutesByDay.length === 7 ? minutesByDay : [...minutesByDay, ...Array(7).fill(0)].slice(0, 7);
  const maxVal = Math.max(GOAL_MINUTES, ...values, 1);
  const chartHeight = 100;
  const goalY = chartHeight - (GOAL_MINUTES / maxVal) * chartHeight;

  return (
    <View style={styles.wrap}>
      <View style={styles.legendRow}>
        <Legend color={brand.primary} label="Đã học" />
        <Legend color={brand.orange} label={`Mục tiêu ${GOAL_MINUTES} phút`} />
      </View>
      <View style={[styles.chartBox, { height: chartHeight + 24 }]}>
        <View
          style={[
            styles.goalLine,
            {
              top: goalY,
              borderColor: brand.orange,
              backgroundColor: `${brand.orange}33`,
            },
          ]}
        />
        <View style={styles.barsRow}>
          {values.map((mins, i) => {
            const h = Math.max(4, (mins / maxVal) * chartHeight);
            const isToday = i === 6;
            return (
              <View key={DAY_LABELS[i]} style={styles.barCol}>
                <View style={[styles.barTrack, { height: chartHeight }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: h,
                        backgroundColor: isToday ? brand.primary : colors.surface.success,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    isToday ? tokens.typography.captionBold : tokens.typography.caption,
                    { color: isToday ? brand.primary : colors.text.tertiary, marginTop: 6 },
                  ]}
                >
                  {isToday ? 'Nay' : DAY_LABELS[i]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  const { tokens, colors } = useTheme();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[tokens.typography.caption, { color: colors.text.tertiary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 8 },
  legendRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  chartBox: { position: 'relative', justifyContent: 'flex-end' },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    zIndex: 1,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  barCol: { flex: 1, alignItems: 'center', maxWidth: 40 },
  barTrack: { width: '70%', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 6 },
});
