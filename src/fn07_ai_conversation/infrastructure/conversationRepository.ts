import { ok, err, type Result } from '../../shared/result';
import { fromTable, type SupabaseLikeClient } from '../../shared/supabaseClient';
import type { ChatMessage, ConversationScenario } from '../domain/conversation';

export type ConversationRepository = {
  listScenarios(): Promise<Result<ConversationScenario[]>>;
  getMessages(sessionId: string): Promise<Result<ChatMessage[]>>;
  appendMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<Result<ChatMessage>>;
  createSession(deviceId: string, scenarioId: string): Promise<Result<string>>;
};

type EdgeInvoke = (body: Record<string, unknown>) => Promise<{ data: unknown; error: Error | null }>;

const MOCK_SCENARIOS: ConversationScenario[] = [
  {
    id: 'sc-standup',
    title: 'Stand-up update',
    description: 'Report progress and blockers in a daily stand-up.',
    level: 'B1',
    topic: 'Agile / Scrum',
  },
  {
    id: 'sc-interview',
    title: 'Technical Interview',
    description: 'Answer technical and behavioral questions.',
    level: 'B2',
    topic: 'Interview',
  },
];

const sessions = new Map<string, ChatMessage[]>();

const AI_REPLIES = [
  'Interesting — can you walk me through your approach?',
  'How would you handle that in a production environment?',
  'Could you give a concrete example from your last project?',
  'What trade-offs did you consider?',
];

function parseMessages(data: unknown): ChatMessage[] {
  const payload = data as { messages?: ChatMessage[] };
  return Array.isArray(payload?.messages) ? payload.messages : [];
}

export function createMockConversationRepository(): ConversationRepository {
  return {
    async listScenarios() {
      return ok(MOCK_SCENARIOS);
    },
    async getMessages(sessionId) {
      return ok(sessions.get(sessionId) ?? []);
    },
    async appendMessage(sessionId, message) {
      const list = sessions.get(sessionId) ?? [];
      const row: ChatMessage = {
        id: `msg-${Date.now()}`,
        ...message,
        createdAt: new Date().toISOString(),
      };
      list.push(row);
      sessions.set(sessionId, list);
      if (message.role === 'user') {
        const reply: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: AI_REPLIES[list.length % AI_REPLIES.length]!,
          createdAt: new Date().toISOString(),
        };
        list.push(reply);
      }
      return ok(row);
    },
    async createSession(deviceId, scenarioId) {
      const id = `sess-${deviceId}-${scenarioId}-${Date.now()}`;
      const scenario = MOCK_SCENARIOS.find((s) => s.id === scenarioId);
      sessions.set(id, [
        {
          id: 'welcome',
          role: 'assistant',
          content: scenario
            ? `Let's practice: ${scenario.title}. How would you start?`
            : 'Hello! How can we practice workplace English today?',
          createdAt: new Date().toISOString(),
        },
      ]);
      return ok(id);
    },
  };
}

export function createSupabaseConversationRepository(
  client: SupabaseLikeClient,
  invoke?: EdgeInvoke,
): ConversationRepository {
  const mock = createMockConversationRepository();

  return {
    async listScenarios() {
      const { data, error } = await fromTable(client, 'conversation_scenarios')
        .select('id, title, description, level, topic')
        .limit(50);
      if (error) return mock.listScenarios();
      const rows = (data ?? []) as Record<string, unknown>[];
      if (!rows.length) return mock.listScenarios();
      return ok(
        rows.map((r) => ({
          id: String(r.id),
          title: String(r.title),
          description: r.description != null ? String(r.description) : null,
          level: r.level != null ? String(r.level) : null,
          topic: r.topic != null ? String(r.topic) : null,
        })),
      );
    },

    async createSession(_deviceId, scenarioId) {
      if (!invoke) return mock.createSession(_deviceId, scenarioId);
      const { data, error } = await invoke({ action: 'start', scenarioId });
      if (error || !data) return mock.createSession(_deviceId, scenarioId);
      const payload = data as { sessionId?: string; messages?: ChatMessage[] };
      if (!payload.sessionId) return err('EDGE_START_FAILED');
      if (payload.messages?.length) {
        sessions.set(payload.sessionId, payload.messages);
      }
      return ok(payload.sessionId);
    },

    async getMessages(sessionId) {
      if (!invoke) return mock.getMessages(sessionId);
      const cached = sessions.get(sessionId);
      if (cached?.length) return ok(cached);
      const { data, error } = await invoke({ action: 'history', sessionId });
      if (error || !data) return mock.getMessages(sessionId);
      const messages = parseMessages(data);
      sessions.set(sessionId, messages);
      return ok(messages);
    },

    async appendMessage(sessionId, message) {
      if (message.role !== 'user') return mock.appendMessage(sessionId, message);
      if (!invoke) return mock.appendMessage(sessionId, message);

      const { data, error } = await invoke({
        action: 'message',
        sessionId,
        content: message.content,
      });
      if (error || !data) return mock.appendMessage(sessionId, message);

      const messages = parseMessages(data);
      sessions.set(sessionId, messages);
      const lastUser = [...messages].reverse().find((m) => m.role === 'user');
      if (lastUser) return ok(lastUser);
      return mock.appendMessage(sessionId, message);
    },
  };
}
