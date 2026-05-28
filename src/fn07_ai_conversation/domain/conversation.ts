export type ConversationScenario = {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  topic: string | null;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};
