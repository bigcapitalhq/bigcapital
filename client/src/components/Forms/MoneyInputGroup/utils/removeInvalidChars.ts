import { escapeRegExp } from './escapeRegExp';

/**
 * Remove invalid characters
 */
export const removeInvalidChars = (value: string, validChars: ReadonlyArray<string>): string => {
  const chars = escapeRegExp(validChars.join(''));
  const reg = new RegExp(`[^\\d${chars}]`, 'gi');
  return value.replace(reg, '');
};
