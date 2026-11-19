import React, { useState } from 'react';
import intl from 'react-intl-universal';
import styles from './AiAssistantEmpty.module.scss';

const SUGGESTIONS = [
  'ai_assistant.suggestion.customer_profit',
  'ai_assistant.suggestion.item_turnover',
  'ai_assistant.suggestion.receivables',
  'ai_assistant.suggestion.profit',
  'ai_assistant.suggestion.cash_position',
  'ai_assistant.suggestion.low_stock',
  'ai_assistant.suggestion.profit_loss',
  'ai_assistant.suggestion.top_items',
  'ai_assistant.suggestion.revenue',
];

const MAX_SUGGESTIONS = 3;

/**
 * Picks a random subset of the suggestion prompts (Fisher-Yates shuffle).
 */
function pickRandomSuggestions(count = MAX_SUGGESTIONS): string[] {
  const shuffled = [...SUGGESTIONS];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

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
  // Re-drawn on each mount (page visit / new chat), stable while mounted.
  const [suggestions] = useState(() => pickRandomSuggestions());

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
            {suggestions.map((suggestion) => (
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
