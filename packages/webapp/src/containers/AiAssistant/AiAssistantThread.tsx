import React, { useEffect, useRef } from 'react';
import { AiAssistantMessage } from './AiAssistantMessage';
import type { UIMessage } from 'ai';

interface AiAssistantThreadProps {
  messages: UIMessage[];
  isStreaming: boolean;
}

/**
 * Full-page chat thread. Auto-scrolls only when the user is already near the
 * bottom so reading older answers is not interrupted by new tokens.
 */
export function AiAssistantThread({
  messages,
  isStreaming,
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
      className="ai-thread"
      ref={threadRef}
      onScroll={handleScroll}
      role="log"
    >
      <div className="ai-thread__inner">
        {messages.map((message) => (
          <AiAssistantMessage key={message.id} message={message} />
        ))}

        {isStreaming ? (
          <div className="ai-thread__typing" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ) : null}
      </div>
    </div>
  );
}
