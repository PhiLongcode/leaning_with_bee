import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  getConversationMessages,
  listConversationScenarios,
  sendChatMessage,
  startConversation,
  type ChatMessage,
  type ConversationScenario,
} from '@hoc-cung-bee/features';
import { FeatureShell } from '../../components/FeatureShell';
import { Card } from '../../components/ui/Card';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useDeviceId } from '../../hooks/useDeviceId';
import { getConversationRepository } from '../../lib/featureRepos';
import { useTheme } from '../../theme/ThemeContext';

export function AiChatScreen() {
  const { colors } = useTheme();
  const deviceId = useDeviceId();
  const [scenarios, setScenarios] = useState<ConversationScenario[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const result = await listConversationScenarios(getConversationRepository());
      if (result.ok) setScenarios(result.value);
      setLoading(false);
    })();
  }, []);

  const refreshMessages = useCallback(async (sid: string) => {
    const result = await getConversationMessages(getConversationRepository(), sid);
    if (result.ok) setMessages(result.value);
  }, []);

  async function pickScenario(scenario: ConversationScenario) {
    const started = await startConversation(getConversationRepository(), deviceId, scenario.id);
    if (started.ok) {
      setSessionId(started.value);
      await refreshMessages(started.value);
    }
  }

  async function send() {
    if (!sessionId || !input.trim()) return;
    await sendChatMessage(getConversationRepository(), sessionId, input);
    setInput('');
    await refreshMessages(sessionId);
  }

  return (
    <FeatureShell title="AI Conversation" req="REQ-07">
      <View style={styles.flex}>
        {!sessionId ? (
          <ScrollView contentContainerStyle={styles.scroll}>
            {loading ? <ActivityIndicator /> : null}
            {scenarios.map((s) => (
              <Card key={s.id} onPress={() => void pickScenario(s)} style={styles.scenario}>
                <Text style={{ color: colors.text.primary, fontWeight: '700' }}>{s.title}</Text>
                <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 4 }}>{s.description}</Text>
              </Card>
            ))}
          </ScrollView>
        ) : (
          <>
            <ScrollView style={styles.messages} contentContainerStyle={styles.msgContent}>
              {messages.map((m) => (
                <View
                  key={m.id}
                  style={[
                    styles.bubble,
                    m.role === 'user'
                      ? { alignSelf: 'flex-end', backgroundColor: colors.surface.info }
                      : { alignSelf: 'flex-start', backgroundColor: colors.background.secondary },
                  ]}
                >
                  <Text style={{ color: colors.text.primary, fontSize: 14 }}>{m.content}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={[styles.composer, { borderTopColor: colors.border.tertiary }]}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Nhập tin nhắn…"
                placeholderTextColor={colors.text.tertiary}
                style={[styles.input, { color: colors.text.primary, borderColor: colors.border.tertiary }]}
              />
              <PrimaryButton label="Gửi" onPress={() => void send()} compact />
            </View>
          </>
        )}
      </View>
    </FeatureShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingBottom: 24 },
  scenario: { marginBottom: 10 },
  messages: { flex: 1 },
  msgContent: { paddingVertical: 12, gap: 8 },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: 14, marginBottom: 8 },
  composer: { flexDirection: 'row', gap: 8, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
});
