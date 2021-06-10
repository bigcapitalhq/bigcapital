import intl from 'react-intl-universal';

export function FormattedMessage({ id }) {
  return intl.get(id);
}

export function FormattedHTMLMessage({ ...args }) {
  return intl.formatHTMLMessage({ ...args })
}