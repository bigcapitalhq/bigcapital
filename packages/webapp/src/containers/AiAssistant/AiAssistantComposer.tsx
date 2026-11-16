import { Button } from '@blueprintjs/core';
import React, { useEffect, useRef } from 'react';
import intl from 'react-intl-universal';
import { Icon } from '@/components';

interface AiAssistantComposerProps {
  value: string;
  isStreaming: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
}

const MAX_INPUT_LENGTH = 2000;

export function AiAssistantComposer({
  value,
  isStreaming,
  disabled,
  onChange,
  onSend,
  onStop,
}: AiAssistantComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) {
      return;
    }
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 180)}px`;
  }, [value]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  const canSend = value.trim().length > 0 && !isStreaming && !disabled;

  return (
    <div className="ai-composer">
      <div className="ai-composer__box">
        <textarea
          ref={textareaRef}
          className="ai-composer__input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={intl.get('ai_assistant.placeholder')}
          rows={1}
          maxLength={MAX_INPUT_LENGTH}
          disabled={disabled}
          aria-label={intl.get('ai_assistant.placeholder')}
        />

        {isStreaming ? (
          <Button
            className="ai-composer__send ai-composer__send--stop"
            onClick={onStop}
            aria-label={intl.get('ai_assistant.stop')}
            title={intl.get('ai_assistant.stop')}
            icon={<Icon icon="pause-16" iconSize={14} />}
          />
        ) : (
          <Button
            intent="primary"
            className="ai-composer__send"
            disabled={!canSend}
            onClick={onSend}
            aria-label={intl.get('ai_assistant.send')}
            title={intl.get('ai_assistant.send')}
            icon={<Icon icon="arrow-upward" iconSize={16} />}
          />
        )}
      </div>
    </div>
  );
}
