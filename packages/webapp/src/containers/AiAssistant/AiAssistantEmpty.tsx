import React from 'react';
import intl from 'react-intl-universal';
import { Icon } from '@/components';

const SUGGESTIONS = [
  'ai_assistant.suggestion.customer_profit',
  'ai_assistant.suggestion.item_turnover',
  'ai_assistant.suggestion.receivables',
  'ai_assistant.suggestion.profit',
];

interface AiAssistantEmptyProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function AiAssistantEmpty({
  onSelect,
  disabled,
}: AiAssistantEmptyProps) {
  return (
    <div className="ai-empty">
      <div className="ai-empty__logo">
        <Icon icon="star-18dp" iconSize={24} />
      </div>
      <h1 className="ai-empty__title">
        {intl.get('ai_assistant.empty_title')}
      </h1>
      <p className="ai-empty__subtitle">
        {intl.get('ai_assistant.empty_subtitle')}
      </p>

      <div className="ai-empty__suggestions">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="ai-empty__suggestion"
            disabled={disabled}
            onClick={() => onSelect(intl.get(suggestion))}
          >
            {intl.get(suggestion)}
          </button>
        ))}
      </div>
    </div>
  );
}
