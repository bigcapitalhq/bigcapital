/**
 * Add group separator to value eg. 1000 > 1,000
 */
export const addSeparators = (value: string, separator = ','): string => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};
