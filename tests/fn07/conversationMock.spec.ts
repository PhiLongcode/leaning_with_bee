import { describe, expect, it } from 'vitest';
import {
  getConversationMessages,
  listConversationScenarios,
  sendChatMessage,
  startConversation,
} from '../../src/fn07_ai_conversation/application/conversationUseCases';
import { createMockConversationRepository } from '../../src/fn07_ai_conversation/infrastructure/conversationRepository';

describe('FN-07 AI Conversation (mock)', () => {
  const repo = createMockConversationRepository();

  it('lists scenarios', async () => {
    const r = await listConversationScenarios(repo);
    expect(r.ok && r.value.length).toBeGreaterThan(0);
  });

  it('starts session with welcome message', async () => {
    const r = await startConversation(repo, 'device-7', 'sc-standup');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toMatch(/^sess-/);
  });

  it('sends message and receives assistant reply', async () => {
    const started = await startConversation(repo, 'device-7b', 'sc-standup');
    expect(started.ok).toBe(true);
    if (!started.ok) return;
    const sent = await sendChatMessage(repo, started.value, 'I blocked on the API.');
    expect(sent.ok).toBe(true);
    const history = await getConversationMessages(repo, started.value);
    expect(history.ok && history.value.length).toBeGreaterThanOrEqual(2);
  });

  it('rejects empty message', async () => {
    const started = await startConversation(repo, 'device-7c', 'sc-standup');
    expect(started.ok).toBe(true);
    if (!started.ok) return;
    const r = await sendChatMessage(repo, started.value, '   ');
    expect(r.ok).toBe(false);
  });
});
