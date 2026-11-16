import { useChat } from '@ai-sdk/react';
import { Alert, Button, Spinner } from '@blueprintjs/core';
import { useQueryClient } from '@tanstack/react-query';
import { DefaultChatTransport, type UIMessage } from 'ai';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { AiAssistantComposer } from './AiAssistantComposer';
import { AiAssistantEmpty } from './AiAssistantEmpty';
import { AiAssistantSidebar } from './AiAssistantSidebar';
import { AiAssistantThread } from './AiAssistantThread';
import { AiAssistantTopbar } from './AiAssistantTopbar';
import { stripHistoricalToolParts } from './utils';
import { Icon } from '@/components';
import { DashboardInsider } from '@/components/Dashboard';
import {
  aiAssistantKeys,
  fetchAiConversation,
  useAiAssistantStatus,
  useAiConversations,
  useCreateAiConversation,
  useDeleteAiConversation,
} from '@/hooks/query/ai-assistant';
import { useAuthOrganizationId, useAuthToken } from '@/hooks/state';
import { useApiFetcher } from '@/hooks/useRequest';
import '@/style/pages/AiAssistant/AiAssistantPage.scss';

interface AiPageStateProps {
  title: string;
  description: string;
}

function AiPageState({ title, description }: AiPageStateProps) {
  return (
    <div className="ai-page__state">
      <div className="ai-page__state-card">
        <div className="ai-page__state-logo">
          <Icon icon="star-18dp" iconSize={20} />
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link to="/" className="ai-page__state-link">
          {intl.get('ai_assistant.back_home')}
        </Link>
      </div>
    </div>
  );
}

export function AiAssistantPage() {
  const token = useAuthToken();
  const organizationId = useAuthOrganizationId();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  const queryClient = useQueryClient();

  const tokenRef = useRef(token);
  const organizationIdRef = useRef(organizationId);
  tokenRef.current = token;
  organizationIdRef.current = organizationId;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/ai/chat',
        headers: () => ({
          Authorization: `Bearer ${tokenRef.current}`,
          'organization-id': organizationIdRef.current ?? '',
        }),
        prepareSendMessagesRequest: ({
          id,
          messages,
          trigger,
          messageId,
          body,
        }) => ({
          body: {
            ...body,
            id,
            trigger,
            messageId,
            messages: stripHistoricalToolParts(messages),
          },
        }),
      }),
    [],
  );

  const {
    messages,
    sendMessage,
    status: chatStatus,
    stop,
    error: chatError,
    regenerate,
    setMessages,
    clearError,
  } = useChat({
    transport,
    experimental_throttle: 50,
    onFinish: () => {
      queryClient.invalidateQueries({
        queryKey: aiAssistantKeys.conversations(),
      });
    },
  });

  const { data: assistantStatus, isLoading: statusLoading } =
    useAiAssistantStatus();
  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    refetch: refetchConversations,
  } = useAiConversations(
    assistantStatus?.enabled === true && assistantStatus?.authorized === true,
  );
  const createConversation = useCreateAiConversation();
  const deleteConversation = useDeleteAiConversation();

  const conversationIdRef = useRef<number | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [conversationTitle, setConversationTitle] = useState<string | null>(
    null,
  );
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const isBusy = chatStatus === 'submitted' || chatStatus === 'streaming';
  const displayError =
    actionError || (chatError ? intl.get('ai_assistant.error') : null);

  const ensureConversation = useCallback(async (): Promise<number> => {
    if (conversationIdRef.current) {
      return conversationIdRef.current;
    }
    const conversation = await createConversation.mutateAsync();
    conversationIdRef.current = conversation.id;
    setConversationId(conversation.id);
    setConversationTitle(conversation.title);
    return conversation.id;
  }, [createConversation]);

  const handleSend = useCallback(
    async (text?: string) => {
      const value = (text ?? input).trim();
      if (!value || isBusy) {
        return;
      }
      clearError();
      setActionError(null);
      setInput('');
      setSidebarOpen(false);

      try {
        const id = await ensureConversation();
        if (!conversationTitle) {
          setConversationTitle(
            value.length > 80 ? `${value.slice(0, 79)}…` : value,
          );
        }
        await sendMessage({ text: value }, { body: { conversationId: id } });
      } catch {
        setActionError(intl.get('ai_assistant.error'));
      }
    },
    [
      input,
      isBusy,
      clearError,
      ensureConversation,
      conversationTitle,
      sendMessage,
    ],
  );

  const handleStop = useCallback(async () => {
    await stop();
  }, [stop]);

  const startNewChat = useCallback(async () => {
    if (isBusy) {
      await stop();
    }
    conversationIdRef.current = null;
    setConversationId(null);
    setConversationTitle(null);
    setMessages([]);
    setInput('');
    setActionError(null);
    setSidebarOpen(false);
    clearError();
  }, [isBusy, stop, setMessages, clearError]);

  const loadConversation = useCallback(
    async (id: number) => {
      if (isBusy) {
        await stop();
      }
      setActionError(null);
      try {
        const conversation = await queryClient.fetchQuery({
          queryKey: aiAssistantKeys.conversation(id),
          queryFn: () => fetchAiConversation(fetcher, id),
        });
        conversationIdRef.current = conversation.id;
        setConversationId(conversation.id);
        setConversationTitle(conversation.title);
        setMessages(conversation.messages as UIMessage[]);
        setSidebarOpen(false);
        clearError();
      } catch {
        setActionError(intl.get('ai_assistant.error'));
      }
    },
    [isBusy, stop, queryClient, fetcher, setMessages, clearError],
  );

  const requestDelete = useCallback((id: number | null) => {
    if (id != null) {
      setPendingDeleteId(id);
    }
  }, []);

  const confirmDelete = useCallback(async () => {
    if (pendingDeleteId == null) {
      return;
    }
    const id = pendingDeleteId;
    setPendingDeleteId(null);

    try {
      await deleteConversation.mutateAsync(id);
      if (conversationIdRef.current === id) {
        await startNewChat();
      }
    } catch {
      setActionError(intl.get('ai_assistant.error'));
    }
  }, [pendingDeleteId, deleteConversation, startNewChat]);

  if (statusLoading) {
    return (
      <DashboardInsider name="ai-assistant">
        <div className="ai-page__loading">
          <Spinner size={36} />
        </div>
      </DashboardInsider>
    );
  }

  if (!assistantStatus?.enabled) {
    return (
      <DashboardInsider name="ai-assistant">
        <AiPageState
          title={intl.get('ai_assistant.disabled_title')}
          description={intl.get('ai_assistant.disabled_description')}
        />
      </DashboardInsider>
    );
  }

  if (!assistantStatus?.authorized) {
    return (
      <DashboardInsider name="ai-assistant">
        <AiPageState
          title={intl.get('ai_assistant.no_access_title')}
          description={intl.get('ai_assistant.no_access_description')}
        />
      </DashboardInsider>
    );
  }

  return (
    <DashboardInsider name="ai-assistant">
      <div className={`ai-page ${sidebarOpen ? 'ai-page--sidebar-open' : ''}`}>
        <div
          className="ai-page__backdrop"
          role="presentation"
          onClick={() => setSidebarOpen(false)}
        />

        <AiAssistantSidebar
          conversations={conversations}
          currentId={conversationId}
          isLoading={conversationsLoading}
          model={assistantStatus.model}
          isOpen={sidebarOpen}
          onNewChat={startNewChat}
          onSelect={loadConversation}
          onDelete={requestDelete}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="ai-page__main">
          <AiAssistantTopbar
            title={conversationTitle || ''}
            model={assistantStatus.model}
            canDelete={conversationId != null}
            onToggleSidebar={() => {
              setSidebarOpen(true);
              refetchConversations();
            }}
            onNewChat={startNewChat}
            onDelete={() => requestDelete(conversationId)}
          />

          <div className="ai-page__body">
            {messages.length === 0 && !isBusy ? (
              <AiAssistantEmpty onSelect={handleSend} />
            ) : (
              <AiAssistantThread
                messages={messages as UIMessage[]}
                isStreaming={isBusy}
              />
            )}
          </div>

          {displayError ? (
            <div className="ai-page__error" role="alert">
              <Icon icon="times-circle" iconSize={14} />
              <span>{displayError}</span>
              {conversationId && !isBusy ? (
                <Button
                  minimal
                  small
                  className="ai-page__retry"
                  icon={<Icon icon="refresh-16" iconSize={12} />}
                  onClick={() => {
                    setActionError(null);
                    regenerate({ body: { conversationId } });
                  }}
                >
                  {intl.get('ai_assistant.retry')}
                </Button>
              ) : null}
            </div>
          ) : null}

          <div className="ai-page__composer-wrap">
            <AiAssistantComposer
              value={input}
              isStreaming={isBusy}
              onChange={setInput}
              onSend={() => handleSend()}
              onStop={handleStop}
            />
            <div className="ai-page__disclaimer">
              {intl.get('ai_assistant.disclaimer')}
            </div>
          </div>
        </main>
      </div>

      <Alert
        isOpen={pendingDeleteId !== null}
        cancelButtonText={intl.get('ai_assistant.cancel')}
        confirmButtonText={intl.get('ai_assistant.delete')}
        icon={<Icon icon="trash-16" iconSize={16} />}
        intent="danger"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
      >
        {intl.get('ai_assistant.delete_message')}
      </Alert>
    </DashboardInsider>
  );
}
