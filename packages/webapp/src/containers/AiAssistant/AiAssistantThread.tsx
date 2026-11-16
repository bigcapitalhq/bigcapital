import React, { useEffect, useRef } from 'react';
import { AiAssistantMessage } from './AiAssistantMessage';
import styles from './AiAssistantThread.module.scss';
import type { UIMessage } from 'ai';

interface AiAssistantThreadProps {
  messages: UIMessage[];
  isStreaming: boolean;
  conversationId?: number | null;
}

/**
 * Full-page chat thread. Auto-scrolls only when the user is already near the
 * bottom so reading older answers is not interrupted by new tokens.
 */
export function AiAssistantThread({
  messages,
  isStreaming,
  conversationId,
}: AiAssistantThreadProps) {
  const threadRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const handleScroll = () => {
    const element = threadRef.current;
    if (!element) {
      return;
    }
    shouldAutoScrollRef.current =
      element.scrollHeight - element.scrollTop - element.clientHeight < 100;
  };

  useEffect(() => {
    const element = threadRef.current;
    if (element && shouldAutoScrollRef.current) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages, isStreaming]);

  return (
    <div
      className={styles.thread}
      ref={threadRef}
      onScroll={handleScroll}
      role="log"
    >
      <div className={styles.inner}>
        {messages.map((message, index) => (
          <AiAssistantMessage
            key={message.id}
            message={message}
            conversationId={conversationId}
            isStreaming={isStreaming && index === messages.length - 1}
          />
        ))}

        {isStreaming ? (
          <div className={styles.typing} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ) : null}
      </div>
    </div>
  );
}
