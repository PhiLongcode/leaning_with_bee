import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppPressable } from '../../components/ui/AppPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getConversationMessages,
  listConversationScenarios,
  sendChatMessage,
  startConversation,
  type ChatMessage,
  type ConversationScenario,
} from '@hoc-cung-bee/features';
import { CuderLogo } from '../../components/brand/CuderLogo';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AppIcon } from '../../components/ui/AppIcon';
import { useDeviceId } from '../../hooks/useDeviceId';
import { getConversationRepository } from '../../lib/featureRepos';
import { darkAi } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

const SUGGESTIONS = [
  'Chụp hình câu hỏi',
  'Giải thích Part 1',
  'Luyện hội thoại meeting',
  'Từ vựng hợp đồng',
];

export function AiChatScreen() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const deviceId = useDeviceId();
  const [scenarios, setScenarios] = useState<ConversationScenario[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const repo = useCallback(() => getConversationRepository(deviceId), [deviceId]);

  useEffect(() => {
    void (async () => {
      const result = await listConversationScenarios(repo());
      if (result.ok) setScenarios(result.value);
      setLoading(false);
    })();
  }, [repo]);

  const refreshMessages = useCallback(async (sid: string) => {
    const result = await getConversationMessages(repo(), sid);
    if (result.ok) setMessages(result.value);
  }, [repo]);

  async function pickScenario(scenario: ConversationScenario) {
    setLoading(true);
    const started = await startConversation(repo(), deviceId, scenario.id);
    if (started.ok) {
      setSessionId(started.value);
      await refreshMessages(started.value);
    }
    setLoading(false);
  }

  async function send() {
    if (!sessionId || !input.trim() || sending) return;
    setSending(true);
    await sendChatMessage(repo(), sessionId, input);
    setInput('');
    await refreshMessages(sessionId);
    setSending(false);
  }

  return (
    <View style={[styles.root, { backgroundColor: darkAi.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[tokens.typography.heading1, { color: '#FFFFFF' }]}>Gia sư AI</Text>
        <View style={[styles.historyBtn, { borderColor: darkAi.accent }]}>
          <AppIcon name="sparkle" size={18} color={darkAi.accent} />
        </View>
      </View>

      {!sessionId ? (
        <ScrollView contentContainerStyle={styles.heroContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <CuderLogo size="md" />
            <View style={styles.bubble}>
              <Text style={[tokens.typography.body, { color: '#1A1A1A' }]}>
                Hi! I&apos;m Cuder — your workplace English tutor.
              </Text>
              <Text style={[tokens.typography.caption, { color: '#757575', marginTop: 6 }]}>
                Xin chào! Hãy chọn gợi ý hoặc kịch bản bên dưới.
              </Text>
            </View>
          </View>

          <View style={styles.suggestGrid}>
            {SUGGESTIONS.map((label) => (
              <AppPressable
                key={label}
                feedback="card"
                rippleColor="rgba(46,204,113,0.25)"
                style={[styles.suggestCard, { backgroundColor: darkAi.surface }]}
                onPress={() => {
                  const first = scenarios[0];
                  if (first) void pickScenario(first);
                }}
              >
                <Text style={[tokens.typography.captionBold, { color: darkAi.accent }]}>{label}</Text>
              </AppPressable>
            ))}
          </View>

          {loading ? <ActivityIndicator color={darkAi.accent} style={{ marginTop: 16 }} /> : null}
          {scenarios.map((s) => (
            <AppPressable
              key={s.id}
              feedback="card"
              rippleColor="rgba(46,204,113,0.25)"
              onPress={() => void pickScenario(s)}
              style={[styles.scenario, { backgroundColor: darkAi.surface }]}
            >
              <Text style={[tokens.typography.heading3, { color: darkAi.accent }]}>{s.title}</Text>
              <Text style={[tokens.typography.caption, { color: darkAi.textMuted, marginTop: 4 }]}>
                {s.description}
              </Text>
            </AppPressable>
          ))}
        </ScrollView>
      ) : (
        <>
          <ScrollView style={styles.messages} contentContainerStyle={styles.msgContent}>
            {messages.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.msgBubble,
                  m.role === 'user'
                    ? { alignSelf: 'flex-end', backgroundColor: darkAi.surface }
                    : { alignSelf: 'flex-start', backgroundColor: '#FFFFFF' },
                ]}
              >
                <Text style={[tokens.typography.body, { color: '#1A1A1A' }]}>{m.content}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
            <AppIcon name="speaking" size={22} color="#FFFFFF" />
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Nhập tin nhắn…"
              placeholderTextColor={darkAi.textMuted}
              style={[
                tokens.textInput,
                styles.input,
                { borderColor: darkAi.accent, color: '#FFFFFF' },
              ]}
            />
            <PrimaryButton
              label={sending ? '…' : 'Gửi'}
              onPress={() => void send()}
              compact
              disabled={sending}
              style={{ flex: 0, minWidth: 72 }}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  historyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: { paddingHorizontal: 20, paddingBottom: 24 },
  hero: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 20 },
  bubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
  },
  suggestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  suggestCard: {
    width: '48%',
    padding: 14,
    borderRadius: 12,
    minHeight: 72,
    justifyContent: 'center',
  },
  scenario: { padding: 14, borderRadius: 12, marginBottom: 10 },
  messages: { flex: 1, paddingHorizontal: 16 },
  msgContent: { paddingVertical: 12, gap: 8 },
  msgBubble: { maxWidth: '85%', padding: 12, borderRadius: 12, marginBottom: 8 },
  composer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    alignItems: 'center',
    backgroundColor: darkAi.background,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
