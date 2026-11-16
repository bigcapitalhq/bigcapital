import { rawRequest } from '@bigcapital/sdk-ts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { aiAssistantKeys } from './query-keys';
import type { UIMessage } from 'ai';

export interface AiAssistantStatus {
  enabled: boolean;
  authorized: boolean;
  model?: string;
}

export interface AiConversationSummary {
  id: number;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AiConversation extends AiConversationSummary {
  messages: UIMessage[];
}

export const fetchAiAssistantStatus = (
  fetcher: ReturnType<typeof useApiFetcher>,
): Promise<AiAssistantStatus> =>
  rawRequest<AiAssistantStatus>(fetcher, 'GET', '/api/ai/status');

export const fetchAiConversations = (
  fetcher: ReturnType<typeof useApiFetcher>,
): Promise<{ data: AiConversationSummary[] }> =>
  rawRequest<{ data: AiConversationSummary[] }>(
    fetcher,
    'GET',
    '/api/ai/conversations',
  );

export const fetchAiConversation = (
  fetcher: ReturnType<typeof useApiFetcher>,
  id: number,
): Promise<AiConversation> =>
  rawRequest<AiConversation>(fetcher, 'GET', `/api/ai/conversations/${id}`);

/**
 * Whether the assistant is configured and the current user can use it.
 */
export function useAiAssistantStatus() {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    queryKey: aiAssistantKeys.status(),
    queryFn: () => fetchAiAssistantStatus(fetcher),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

/**
 * Lists the current user's conversations.
 */
export function useAiConversations(enabled: boolean = true) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    queryKey: aiAssistantKeys.conversations(),
    queryFn: () => fetchAiConversations(fetcher),
    select: (response) => response.data,
    staleTime: 30 * 1000,
    enabled,
    retry: false,
  });
}

/**
 * Loads a conversation with its messages.
 */
export function useAiConversation(id: number | null) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    queryKey: aiAssistantKeys.conversation(id ?? 0),
    queryFn: () => fetchAiConversation(fetcher, id as number),
    enabled: id != null,
    staleTime: 0,
  });
}

/**
 * Creates an empty conversation.
 */
export function useCreateAiConversation() {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      rawRequest<AiConversationSummary>(
        fetcher,
        'POST',
        '/api/ai/conversations',
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: aiAssistantKeys.conversations(),
      });
    },
  });
}

/**
 * Deletes a conversation and its messages.
 */
export function useDeleteAiConversation() {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      rawRequest<void>(fetcher, 'DELETE', `/api/ai/conversations/${id}`),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: aiAssistantKeys.conversations(),
      });
      queryClient.removeQueries({
        queryKey: aiAssistantKeys.conversation(id),
      });
    },
  });
}
