import { Button } from '@blueprintjs/core';
import { getToolName, isDynamicToolUIPart, isToolUIPart } from 'ai';
import React, { useMemo, useState } from 'react';
import intl from 'react-intl-universal';
import { AiMarkdown } from './AiMarkdown';
import { formatToolNumber } from './utils';
import type { AiMessageFeedback } from '@/hooks/query/ai-assistant';
import type { UIMessage } from 'ai';
import { Icon } from '@/components';
import { useSetAiMessageFeedback } from '@/hooks/query/ai-assistant';

const TOOL_LABEL_KEYS: Record<string, string> = {
  search_business_records: 'ai_assistant.tool.searching',
  get_financial_summary: 'ai_assistant.tool.financial_summary',
  get_profit_and_loss_breakdown: 'ai_assistant.tool.profit_loss',
  get_top_customers_by_profit: 'ai_assistant.tool.top_customers',
  get_customer_profitability: 'ai_assistant.tool.customer_profitability',
  get_item_performance: 'ai_assistant.tool.item_performance',
  get_outstanding_receivables: 'ai_assistant.tool.receivables',
  get_cash_position: 'ai_assistant.tool.cash_position',
  get_inventory_levels: 'ai_assistant.tool.inventory',
};

const getToolLabel = (toolName: string): string => {
  return intl.get(TOOL_LABEL_KEYS[toolName] || 'ai_assistant.tool.generic');
};

interface ToolResultPreviewProps {
  toolName: string;
  output: unknown;
}

function ToolResultPreview({ toolName, output }: ToolResultPreviewProps) {
  if (!output || typeof output !== 'object') {
    return null;
  }
  const data = output as Record<string, any>;
  const rows = data.customers ?? data.items ?? data.accounts ?? data.matches;

  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }
  const currency = typeof data.currency === 'string' ? data.currency : null;

  if (Array.isArray(data.customers)) {
    return (
      <div className="ai-assistant-tool__preview">
        <table>
          <thead>
            <tr>
              <th>{intl.get('ai_assistant.table.customer')}</th>
              <th>{intl.get('ai_assistant.table.revenue')}</th>
              <th>{intl.get('ai_assistant.table.profit')}</th>
              <th>{intl.get('ai_assistant.table.margin')}</th>
            </tr>
          </thead>
          <tbody>
            {data.customers.slice(0, 5).map((row: any) => (
              <tr key={row.customerId}>
                <td>{row.customerName}</td>
                <td>{formatToolNumber(row.revenue)}</td>
                <td>{formatToolNumber(row.grossProfit)}</td>
                <td>{formatToolNumber(row.marginPct)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        {currency ? (
          <div className="ai-assistant-tool__currency">{currency}</div>
        ) : null}
      </div>
    );
  }

  if (Array.isArray(data.items)) {
    return (
      <div className="ai-assistant-tool__preview">
        <table>
          <thead>
            <tr>
              <th>{intl.get('ai_assistant.table.item')}</th>
              <th>{intl.get('ai_assistant.table.units')}</th>
              <th>{intl.get('ai_assistant.table.revenue')}</th>
              <th>{intl.get('ai_assistant.table.profit')}</th>
            </tr>
          </thead>
          <tbody>
            {data.items.slice(0, 5).map((row: any) => (
              <tr key={row.itemId}>
                <td>{row.itemName}</td>
                <td>{formatToolNumber(row.unitsSold)}</td>
                <td>{formatToolNumber(row.revenue)}</td>
                <td>{formatToolNumber(row.grossProfit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {currency ? (
          <div className="ai-assistant-tool__currency">{currency}</div>
        ) : null}
      </div>
    );
  }

  if (Array.isArray(data.accounts)) {
    return (
      <div className="ai-assistant-tool__preview">
        <table>
          <thead>
            <tr>
              <th>{intl.get('ai_assistant.table.account')}</th>
              <th>{intl.get('ai_assistant.table.balance')}</th>
            </tr>
          </thead>
          <tbody>
            {data.accounts.slice(0, 5).map((row: any) => (
              <tr key={row.accountId}>
                <td>{row.name}</td>
                <td>{formatToolNumber(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {currency ? (
          <div className="ai-assistant-tool__currency">{currency}</div>
        ) : null}
      </div>
    );
  }

  if (Array.isArray(data.matches)) {
    return (
      <div className="ai-assistant-tool__preview">
        <table>
          <thead>
            <tr>
              <th>{intl.get('ai_assistant.table.name')}</th>
              <th>{intl.get('ai_assistant.table.code')}</th>
            </tr>
          </thead>
          <tbody>
            {data.matches.slice(0, 5).map((row: any) => (
              <tr key={`${toolName}-${row.id}`}>
                <td>{row.name}</td>
                <td>{row.code || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

function ToolCall({ part }: { part: any }) {
  const toolName = getToolName(part);
  const state = part.state;
  const isError = state === 'output-error';
  const isDone = state === 'output-available';
  const output = part.output;

  const icon = isError
    ? 'times-circle'
    : isDone
      ? 'checkmark-16'
      : 'refresh-16';
  const label = getToolLabel(toolName);
  const displayLabel = isDone || isError ? label.replace(/…$/, '') : label;

  return (
    <div
      className={`ai-assistant-tool ${
        isError ? 'ai-assistant-tool--error' : ''
      } ${isDone ? 'ai-assistant-tool--done' : ''}`}
    >
      <div className="ai-assistant-tool__line">
        <Icon
          icon={icon}
          iconSize={14}
          className={!isDone && !isError ? 'ai-assistant-tool__spin' : ''}
        />
        <span>{displayLabel}</span>
      </div>

      {isError ? (
        <div className="ai-assistant-tool__error">
          {part.errorText || intl.get('ai_assistant.tool.failed')}
        </div>
      ) : null}

      {isDone && output && typeof output === 'object' ? (
        (output as any).error ? (
          <div className="ai-assistant-tool__error">
            {(output as any).error}
          </div>
        ) : (
          <>
            <ToolResultPreview toolName={toolName} output={output} />
            <details className="ai-assistant-tool__details">
              <summary>{intl.get('ai_assistant.tool.view_data')}</summary>
              <pre>{JSON.stringify(output, null, 2)}</pre>
            </details>
          </>
        )
      ) : null}
    </div>
  );
}

interface AiAssistantMessageProps {
  message: UIMessage;
  conversationId?: number | null;
  isStreaming?: boolean;
}

const getInitialFeedback = (message: UIMessage): AiMessageFeedback | null => {
  const feedback = (message.metadata as Record<string, unknown> | undefined)
    ?.feedback;
  return feedback === 'like' || feedback === 'dislike' ? feedback : null;
};

export function AiAssistantMessage({
  message,
  conversationId,
  isStreaming = false,
}: AiAssistantMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<AiMessageFeedback | null>(() =>
    getInitialFeedback(message),
  );
  const setFeedbackMutation = useSetAiMessageFeedback();

  const copyText = useMemo(() => {
    return message.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n\n')
      .trim();
  }, [message.parts]);

  /**
   * Hide the actions row while tokens are still arriving. Doing so avoids
   * rating a response that is about to be replaced.
   */
  const hasStreamingPart = useMemo(
    () =>
      message.parts.some((part) => {
        const state = (part as { state?: string }).state;
        return state === 'streaming' || state === 'input-streaming';
      }),
    [message.parts],
  );

  const handleCopy = async () => {
    if (!copyText) {
      return;
    }
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked by the browser; ignore.
    }
  };

  const handleFeedback = (next: AiMessageFeedback) => {
    if (!conversationId || setFeedbackMutation.isPending) {
      return;
    }
    const previous = feedback;
    const value = previous === next ? null : next;

    // Optimistically reflect the selection; revert if the request fails.
    setFeedback(value);
    setFeedbackMutation.mutate(
      { conversationId, messageId: message.id, feedback: value },
      { onError: () => setFeedback(previous) },
    );
  };

  const showActions =
    !isUser && !isStreaming && !hasStreamingPart && message.parts.length > 0;

  return (
    <div
      className={`ai-assistant-message ${
        isUser
          ? 'ai-assistant-message--user'
          : 'ai-assistant-message--assistant'
      }`}
    >
      <div className="ai-assistant-message__body">
        {message.parts.map((part, index) => {
          if (part.type === 'text') {
            return isUser ? (
              <div key={index} className="ai-assistant-message__text">
                {part.text}
              </div>
            ) : (
              <AiMarkdown key={index}>{part.text}</AiMarkdown>
            );
          }

          if (isToolUIPart(part) || isDynamicToolUIPart(part)) {
            return <ToolCall key={part.toolCallId ?? index} part={part} />;
          }

          return null;
        })}

        {showActions ? (
          <div className="ai-assistant-message__actions">
            {copyText ? (
              <Button
                minimal
                small
                className="ai-assistant-message__action"
                aria-label={intl.get('ai_assistant.copy')}
                title={intl.get('ai_assistant.copy')}
                icon={<Icon icon="content-copy" iconSize={13} />}
                onClick={handleCopy}
              />
            ) : null}
            {copied ? (
              <span className="ai-assistant-message__copied">
                {intl.get('ai_assistant.copied')}
              </span>
            ) : null}
            {copyText ? (
              <span
                className="ai-assistant-message__actions-divider"
                aria-hidden="true"
              />
            ) : null}
            <Button
              minimal
              small
              className={`ai-assistant-message__action ${
                feedback === 'like'
                  ? 'ai-assistant-message__action--like-active'
                  : ''
              }`}
              aria-label={intl.get('ai_assistant.like')}
              aria-pressed={feedback === 'like'}
              title={intl.get('ai_assistant.like')}
              disabled={!conversationId || setFeedbackMutation.isPending}
              icon={<Icon icon="thumbs-up" iconSize={13} />}
              onClick={() => handleFeedback('like')}
            />
            <Button
              minimal
              small
              className={`ai-assistant-message__action ${
                feedback === 'dislike'
                  ? 'ai-assistant-message__action--dislike-active'
                  : ''
              }`}
              aria-label={intl.get('ai_assistant.dislike')}
              aria-pressed={feedback === 'dislike'}
              title={intl.get('ai_assistant.dislike')}
              disabled={!conversationId || setFeedbackMutation.isPending}
              icon={<Icon icon="thumbs-down" iconSize={13} />}
              onClick={() => handleFeedback('dislike')}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
