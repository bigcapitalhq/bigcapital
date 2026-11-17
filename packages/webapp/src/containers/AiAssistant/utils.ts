import type { UIMessage } from 'ai';

/**
 * Drops historical tool parts before sending the conversation back to the
 * server. Tool results are only needed during the tool loop of the current
 * request; sending old results back inflates the payload and token usage and
 * lets a client fabricate tool output.
 */
export const stripHistoricalToolParts = (
  messages: UIMessage[],
): UIMessage[] => {
  const recent = messages.slice(-40);
  const firstUserIndex = recent.findIndex((message) => message.role === 'user');
  const relevant = firstUserIndex > 0 ? recent.slice(firstUserIndex) : recent;

  return relevant.flatMap((message) => {
    const parts = message.parts.filter((part) => part.type === 'text');
    if (parts.length === 0) {
      return [];
    }
    const { metadata: _metadata, ...rest } = message;
    return [{ ...rest, parts }];
  });
};

/**
 * Formats a numeric value for compact tool-result tables.
 */
export const formatToolNumber = (value: unknown): string => {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return '—';
  }
  return number.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
};
