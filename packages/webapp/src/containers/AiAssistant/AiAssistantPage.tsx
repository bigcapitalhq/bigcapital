import { useChat } from '@ai-sdk/react';
import { Button, Spinner } from '@blueprintjs/core';
import { DefaultChatTransport, type UIMessage } from 'ai';
import classnames from 'classnames';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { AiAssistantComposer } from './AiAssistantComposer';
import { AiAssistantEmpty } from './AiAssistantEmpty';
import styles from './AiAssistantPage.module.scss';
import { AiAssistantThread } from './AiAssistantThread';
import { stripHistoricalToolParts } from './utils';
import { Icon } from '@/components';
import { DashboardInsider } from '@/components/Dashboard';
import {
  useAiAssistantStatus,
  useCreateAiConversation,
} from '@/hooks/query/ai-assistant';
import { useAuthOrganizationId, useAuthToken } from '@/hooks/state';

interface AiPageStateProps {
  title: string;
  description: string;
}

function AiPageState({ title, description }: AiPageStateProps) {
  return (
    <div className={styles.state}>
      <div className={styles.stateCard}>
        <div className={styles.stateLogo}>
          <Icon icon="star-18dp" iconSize={20} />
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link to="/" className={styles.stateLink}>
          {intl.get('ai_assistant.back_home')}
        </Link>
      </div>
    </div>
  );
}

export function AiAssistantPage() {
  const token = useAuthToken();
  const organizationId = useAuthOrganizationId();

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
    clearError,
  } = useChat({
    transport,
    experimental_throttle: 50,
  });

  const { data: assistantStatus, isLoading: statusLoading } =
    useAiAssistantStatus();
  const createConversation = useCreateAiConversation();

  const conversationIdRef = useRef<number | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const isBusy = chatStatus === 'submitted' || chatStatus === 'streaming';
  const isEmpty = messages.length === 0 && !isBusy;
  const displayError =
    actionError || (chatError ? intl.get('ai_assistant.error') : null);

  const ensureConversation = useCallback(async (): Promise<number> => {
    if (conversationIdRef.current) {
      return conversationIdRef.current;
    }
    const conversation = await createConversation.mutateAsync();
    conversationIdRef.current = conversation.id;
    setConversationId(conversation.id);
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

      try {
        const id = await ensureConversation();
        await sendMessage({ text: value }, { body: { conversationId: id } });
      } catch {
        setActionError(intl.get('ai_assistant.error'));
      }
    },
    [input, isBusy, clearError, ensureConversation, sendMessage],
  );

  const handleStop = useCallback(async () => {
    await stop();
  }, [stop]);

  const composer = (
    <>
      {displayError ? (
        <div
          className={classnames(styles.error, {
            [styles.errorInline]: isEmpty,
          })}
          role="alert"
        >
          <Icon icon="times-circle" iconSize={14} />
          <span>{displayError}</span>
          {conversationId && !isBusy ? (
            <Button
              minimal
              small
              className={styles.retry}
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

      <AiAssistantComposer
        value={input}
        isStreaming={isBusy}
        onChange={setInput}
        onSend={() => handleSend()}
        onStop={handleStop}
      />
    </>
  );

  if (statusLoading) {
    return (
      <DashboardInsider name="ai-assistant">
        <div className={styles.loading}>
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
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.body}>
            {isEmpty ? (
              <AiAssistantEmpty onSelect={handleSend} composer={composer} />
            ) : (
              <AiAssistantThread
                messages={messages as UIMessage[]}
                isStreaming={isBusy}
                conversationId={conversationId}
              />
            )}
          </div>

          {!isEmpty ? (
            <div className={styles.composerWrap}>{composer}</div>
          ) : null}
        </main>
      </div>
    </DashboardInsider>
  );
}
