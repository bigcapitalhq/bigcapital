export const AI_ASSISTANT = 'AI_ASSISTANT';

export const aiAssistantKeys = {
  all: () => [AI_ASSISTANT] as const,
  status: () => [AI_ASSISTANT, 'status'] as const,
  conversations: () => [AI_ASSISTANT, 'conversations'] as const,
  conversation: (id: number) => [AI_ASSISTANT, 'conversations', id] as const,
};
