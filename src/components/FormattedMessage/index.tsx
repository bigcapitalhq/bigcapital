// @ts-nocheck
import intl from 'react-intl-universal';

export function FormattedMessage({ id, values }) {
  return intl.get(id, values);
}

export function FormattedHTMLMessage({ ...args }) {
  return intl.formatHTMLMessage({ ...args });
}

export const T = FormattedMessage;
