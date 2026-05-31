import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  scorePronunciation,
  SPEECH_PROMPTS,
  startSpeechSession,
  submitSpeechTranscript,
} from '@hoc-cung-bee/features';
import { FeatureShell } from '../../components/FeatureShell';
import { Card } from '../../components/ui/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useDeviceId } from '../../hooks/useDeviceId';
import { awardXp } from '../../lib/gamification';
import { scoreSpeechPractice } from '../../lib/speechPracticeApi';
import { useTheme } from '../../theme/ThemeContext';

export function SpeakingScreen() {
  const { colors, tokens } = useTheme();
  const deviceId = useDeviceId();
  const [prompt] = useState(SPEECH_PROMPTS[0]!);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [pronunciation, setPronunciation] = useState<string | null>(null);

  function begin() {
    const result = startSpeechSession(deviceId, prompt);
    if (result.ok) setSessionId(result.value.id);
  }

  async function check() {
    if (!sessionId || !transcript.trim()) return;

    const remote = await scoreSpeechPractice(deviceId, prompt, transcript);
    if (remote) {
      setMatchScore(remote.matchScore);
      setPronunciation(`${remote.score}/100 — ${remote.feedback}${remote.persisted ? ' (đã lưu DB)' : ''}`);
      void awardXp(deviceId, Math.round(remote.score / 10));
      return;
    }

    const stt = submitSpeechTranscript(sessionId, transcript);
    if (!stt.ok) return;
    setMatchScore(stt.value.matchScore);
    const scored = scorePronunciation(sessionId, prompt, transcript);
    if (scored.ok) {
      setPronunciation(`${scored.value.score}/100 — ${scored.value.feedback}`);
      void awardXp(deviceId, Math.round(scored.value.score / 10));
    }
  }

  return (
    <FeatureShell title="Luyện nói" variant="green">
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card>
          <Text style={{ color: colors.text.tertiary, fontSize: 11, fontWeight: '700' }}>CÂU MẪU</Text>
          <Text style={{ color: colors.text.primary, fontSize: 16, lineHeight: 24, marginTop: 8 }}>{prompt}</Text>
          <PrimaryButton label="Bắt đầu luyện" onPress={begin} style={{ marginTop: 12 }} />
        </Card>
        {sessionId ? (
          <Card style={{ marginTop: 12 }}>
            <Text style={{ color: colors.text.secondary, fontSize: 12, marginBottom: 8 }}>
              Demo STT: nhập những gì bạn nói (Whisper sẽ tích hợp sau)
            </Text>
            <TextInput
              multiline
              value={transcript}
              onChangeText={setTranscript}
              placeholder="I will deploy the hotfix..."
              placeholderTextColor={colors.text.tertiary}
              style={[
                tokens.textInput,
                styles.input,
                { color: colors.text.primary, borderColor: colors.border.tertiary },
              ]}
            />
            <PrimaryButton label="Chấm điểm" onPress={() => void check()} style={{ marginTop: 8 }} />
            {matchScore != null ? (
              <Text style={{ color: colors.surface.successText, marginTop: 12, fontWeight: '600' }}>
                Khớp mẫu: {matchScore}%
              </Text>
            ) : null}
            {pronunciation ? (
              <Text style={{ color: colors.text.primary, marginTop: 8, lineHeight: 22 }}>{pronunciation}</Text>
            ) : null}
          </Card>
        ) : null}
      </ScrollView>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 80, textAlignVertical: 'top' },
});
