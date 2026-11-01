import intl from 'react-intl-universal';
import type { ReactElement } from 'react';

interface FormattedMessageProps {
  id: string;
  values?: Record<string, any>;
}

export function FormattedMessage({
  id,
  values,
}: FormattedMessageProps): ReactElement {
  return <>{intl.get(id, values)}</>;
}

export function FormattedHTMLMessage({
  id,
  values,
}: FormattedMessageProps): ReactElement {
  // `formatHTMLMessage` returns a plain string. A string is a valid child but
  // not a valid component return type before TypeScript 5.1, so the message is
  // wrapped in a fragment — the rendered output (a text node) is identical.
  const descriptor = { id, ...(values !== undefined ? { values } : {}) };

  return <>{intl.formatHTMLMessage(descriptor)}</>;
}

export const T = FormattedMessage;
