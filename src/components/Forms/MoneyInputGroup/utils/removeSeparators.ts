import { escapeRegExp } from './escapeRegExp';

/**
 * Remove group separator from value eg. 1,000 > 1000
 */
export const removeSeparators = (value: string, separator = ','): string => {
  const reg = new RegExp(escapeRegExp(separator), 'g');
  return value.replace(reg, '');
};
