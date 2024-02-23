// @ts-nocheck
import intl from 'react-intl-universal';

interface FormattedMessageProps {
  id: string;
  values?: Record<string, any>;
}

export function FormattedMessage({ id, values }: FormattedMessageProps) {
  return <>{intl.get(id, values)}</>;
}

export function FormattedHTMLMessage({ ...args }) {
  return intl.formatHTMLMessage({ ...args });
}

export const T = FormattedMessage;
