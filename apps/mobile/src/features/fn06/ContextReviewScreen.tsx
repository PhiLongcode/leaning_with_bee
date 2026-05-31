import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppPressable } from '../../components/ui/AppPressable';
import {
  buildContextReviewQuizFromLesson,
  gradeContextReviewAnswer,
  type ContextReviewQuestion,
} from '@hoc-cung-bee/features';
import { Card } from '../../components/ui/Card';
import { GreenScreenLayout } from '../../components/ui/GreenScreenLayout';
import { AppIcon } from '../../components/ui/AppIcon';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useDeviceId } from '../../hooks/useDeviceId';
import { onContextQuizAnswered } from '../../lib/learningFlowActions';
import { useAppStore } from '../../store/appStore';
import { useTheme } from '../../theme/ThemeContext';

const LESSONS = ['Photographs 01', 'Photographs 02', 'Photographs 03', 'Photographs 04'];

export function ContextReviewScreen() {
  const { colors, brand, tokens, isDark } = useTheme();
  const deviceId = useDeviceId();
  const lastLessonWords = useAppStore((s) => s.lastLessonWords);
  const setScreen = useAppStore((s) => s.setScreen);
  const [questions, setQuestions] = useState<ContextReviewQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const tagBg = isDark ? colors.surface.success : brand.primaryLight;
  const tagText = isDark ? colors.surface.successText : brand.primaryDark;

  useEffect(() => {
    const result = buildContextReviewQuizFromLesson(lastLessonWords, 5);
    if (result.ok) setQuestions(result.value);
    setLoading(false);
  }, [lastLessonWords]);

  const q = questions[index];

  function answer(choiceIndex: number) {
    if (!q) return;
    const graded = gradeContextReviewAnswer(q, choiceIndex);
    if (graded.ok) {
      setFeedback(graded.value.correct ? 'Đúng! +10 XP' : 'Chưa đúng — xem lại ngữ cảnh.');
      void onContextQuizAnswered(deviceId, q.vocabulary.id, graded.value.correct);
      setTimeout(() => {
        setFeedback(null);
        if (index < questions.length - 1) {
          setIndex((i) => i + 1);
        } else {
          setFinished(true);
        }
      }, 900);
    }
  }

  if (!quizStarted) {
    return (
      <View style={{ flex: 1 }}>
        <GreenScreenLayout title="Part 1" onBack={() => setScreen('home')} headerColor="part" sheetPaddingBottom={72}>
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {LESSONS.map((title, i) => (
              <Card key={title} style={styles.lessonCard} onPress={() => setQuizStarted(true)}>
                <View style={styles.lessonTop}>
                  <Text style={[tokens.typography.heading3, { color: colors.text.primary }]}>{title}</Text>
                  <View style={styles.lessonTopRight}>
                    {i >= 3 ? <Text style={{ fontSize: 18 }}>👑</Text> : null}
                    <AppIcon name="history" size={20} color={colors.text.secondary} />
                  </View>
                </View>
                <View style={styles.metaRow}>
                  <View style={[styles.tag, { backgroundColor: tagBg }]}>
                    <Text style={[tokens.typography.captionBold, { color: tagText }]}>2026 Format</Text>
                  </View>
                  <Text style={[tokens.typography.caption, { color: colors.text.tertiary }]}>
                    ○ Chưa làm
                  </Text>
                </View>
              </Card>
            ))}
          </ScrollView>
        </GreenScreenLayout>
        <View style={styles.floatingBar}>
          <Text style={[tokens.typography.captionBold, { color: '#FFFFFF' }]}>
            {'>> Bài học đề xuất · Photographs 01'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <GreenScreenLayout title="Context Review" onBack={() => setScreen('home')} headerColor="part">
      <ScrollView contentContainerStyle={styles.quizScroll} showsVerticalScrollIndicator={false}>
        {loading ? <ActivityIndicator color={brand.primary} /> : null}
        {q ? (
          <Card>
            <Text style={[tokens.typography.caption, { color: colors.text.tertiary }]}>
              Câu {index + 1}/{questions.length}
            </Text>
            <Text style={[tokens.typography.body, { color: colors.text.primary, marginVertical: 12 }]}>
              {q.prompt}
            </Text>
            {q.choices.map((choice, i) => (
              <AppPressable
                key={choice}
                feedback="chip"
                onPress={() => answer(i)}
                style={[styles.choice, { borderColor: colors.border.tertiary }]}
              >
                <Text style={[tokens.typography.bodyMedium, { color: colors.text.primary }]}>{choice}</Text>
              </AppPressable>
            ))}
            {feedback ? (
              <Text
                style={{
                  marginTop: 12,
                  color: feedback.startsWith('Đúng') ? brand.primary : brand.error,
                  fontWeight: '600',
                }}
              >
                {feedback}
              </Text>
            ) : null}
          </Card>
        ) : null}
        {finished ? (
          <PrimaryButton title="Về trang chủ" onPress={() => setScreen('home')} style={{ marginTop: 16 }} />
        ) : null}
      </ScrollView>
    </GreenScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { padding: 20, paddingBottom: 24, gap: 12 },
  lessonCard: { marginBottom: 0 },
  lessonTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lessonTopRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  floatingBar: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  quizScroll: { padding: 20, paddingBottom: 32 },
  choice: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
});
