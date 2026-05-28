import type { ChatMessage, ConversationScenario } from '../domain/conversation';
import type { ConversationRepository } from '../infrastructure/conversationRepository';
import type { Result } from '../../shared/result';

export function listConversationScenarios(
  repo: ConversationRepository,
): Promise<Result<ConversationScenario[]>> {
  return repo.listScenarios();
}

export function startConversation(
  repo: ConversationRepository,
  deviceId: string,
  scenarioId: string,
): Promise<Result<string>> {
  return repo.createSession(deviceId, scenarioId);
}

export function getConversationMessages(
  repo: ConversationRepository,
  sessionId: string,
): Promise<Result<ChatMessage[]>> {
  return repo.getMessages(sessionId);
}

export function sendChatMessage(
  repo: ConversationRepository,
  sessionId: string,
  content: string,
): Promise<Result<ChatMessage>> {
  if (!content.trim()) return Promise.resolve({ ok: false, error: 'Tin nhắn trống.' });
  return repo.appendMessage(sessionId, { role: 'user', content: content.trim() });
}
