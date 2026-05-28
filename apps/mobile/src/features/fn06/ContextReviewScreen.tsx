import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  buildContextReviewQuiz,
  gradeContextReviewAnswer,
  type ContextReviewQuestion,
} from '@hoc-cung-bee/features';
import { FeatureShell } from '../../components/FeatureShell';
import { Card } from '../../components/ui/Card';
import { useDeviceId } from '../../hooks/useDeviceId';
import { awardXp } from '../../lib/gamification';
import { useTheme } from '../../theme/ThemeContext';

export function ContextReviewScreen() {
  const { colors, brand } = useTheme();
  const deviceId = useDeviceId();
  const [questions, setQuestions] = useState<ContextReviewQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const result = buildContextReviewQuiz(5);
    if (result.ok) setQuestions(result.value);
    setLoading(false);
  }, []);

  const q = questions[index];

  function answer(choiceIndex: number) {
    if (!q) return;
    const graded = gradeContextReviewAnswer(q, choiceIndex);
    if (graded.ok) {
      setFeedback(graded.value.correct ? 'Đúng! +10 XP' : 'Chưa đúng — xem lại ngữ cảnh.');
      void awardXp(deviceId, graded.value.xp);
      setTimeout(() => {
        setFeedback(null);
        if (index < questions.length - 1) setIndex((i) => i + 1);
      }, 900);
    }
  }

  return (
    <FeatureShell title="Context Review" req="REQ-06">
      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? <ActivityIndicator /> : null}
        {q ? (
          <Card>
            <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>
              Câu {index + 1}/{questions.length}
            </Text>
            <Text style={[styles.prompt, { color: colors.text.primary }]}>{q.prompt}</Text>
            {q.choices.map((c, i) => (
              <Pressable
                key={c}
                onPress={() => answer(i)}
                style={[styles.choice, { borderColor: colors.border.tertiary, backgroundColor: colors.background.secondary }]}
              >
                <Text style={{ color: colors.text.primary }}>{c}</Text>
              </Pressable>
            ))}
            {feedback ? (
              <Text style={{ color: feedback.startsWith('Đúng') ? brand.primary : '#FF4B4B', marginTop: 12, fontWeight: '600' }}>
                {feedback}
              </Text>
            ) : null}
          </Card>
        ) : null}
      </ScrollView>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  prompt: { fontSize: 16, lineHeight: 24, marginVertical: 12, fontWeight: '500' },
  choice: { padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
});
