import React from 'react';
import intl from 'react-intl-universal';

const SUGGESTIONS = [
  'ai_assistant.suggestion.customer_profit',
  'ai_assistant.suggestion.item_turnover',
  'ai_assistant.suggestion.receivables',
  'ai_assistant.suggestion.profit',
];

interface AiAssistantEmptyProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
  composer?: React.ReactNode;
}

export function AiAssistantEmpty({
  onSelect,
  disabled,
  composer,
}: AiAssistantEmptyProps) {
  return (
    <div className="ai-empty">
      <div className="ai-empty__inner">
        <h1 className="ai-empty__title">
          {intl.get('ai_assistant.empty_title')}
        </h1>

        {composer ? <div className="ai-empty__composer">{composer}</div> : null}

        <div className="ai-empty__suggestions-block">
          <h2 className="ai-empty__suggestions-title">
            {intl.get('ai_assistant.suggestions_title')}
          </h2>

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
      </div>
    </div>
  );
}
