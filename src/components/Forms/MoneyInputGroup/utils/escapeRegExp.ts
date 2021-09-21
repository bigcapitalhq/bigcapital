/**
 * Escape regex char
 *
 * See: https://stackoverflow.com/questions/17885855/use-dynamic-variable-string-as-regex-pattern-in-javascript
 */
export const escapeRegExp = (stringToGoIntoTheRegex: string): string => {
  return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
