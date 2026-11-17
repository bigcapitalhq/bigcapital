import React from 'react';
import intl from 'react-intl-universal';
import styles from './AiAssistantEmpty.module.scss';

const SUGGESTIONS = [
  'ai_assistant.suggestion.customer_profit',
  'ai_assistant.suggestion.item_turnover',
  'ai_assistant.suggestion.receivables',
  'ai_assistant.suggestion.profit',
  'ai_assistant.suggestion.balance_sheet',
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
    <div className={styles.empty}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{intl.get('ai_assistant.empty_title')}</h1>

        {composer ? <div className={styles.composer}>{composer}</div> : null}

        <div className={styles.suggestionsBlock}>
          <h2 className={styles.suggestionsTitle}>
            {intl.get('ai_assistant.suggestions_title')}
          </h2>

          <div className={styles.suggestions}>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className={styles.suggestion}
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
