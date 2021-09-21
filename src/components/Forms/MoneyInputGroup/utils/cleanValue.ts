import { parseAbbrValue } from './parseAbbrValue';
import { removeSeparators } from './removeSeparators';
import { removeInvalidChars } from './removeInvalidChars';
import { escapeRegExp } from './escapeRegExp';

export type CleanValueOptions = {
  value: string;
  decimalSeparator?: string;
  groupSeparator?: string;
  allowDecimals?: boolean;
  decimalsLimit?: number;
  allowNegativeValue?: boolean;
  turnOffAbbreviations?: boolean;
  prefix?: string;
};

/**
 * Remove prefix, separators and extra decimals from value
 */
export const cleanValue = ({
  value,
  groupSeparator = ',',
  decimalSeparator = '.',
  allowDecimals = true,
  decimalsLimit = 2,
  allowNegativeValue = true,
  turnOffAbbreviations = false,
  prefix = '',
}: CleanValueOptions): string => {
  const abbreviations = turnOffAbbreviations ? [] : ['k', 'm', 'b'];
  const isNegative = value.includes('-');

  const [prefixWithValue, preValue] = RegExp(`(\\d+)-?${escapeRegExp(prefix)}`).exec(value) || [];
  const withoutPrefix = prefix ? value.replace(prefixWithValue, '').concat(preValue) : value;
  const withoutSeparators = removeSeparators(withoutPrefix, groupSeparator);
  const withoutInvalidChars = removeInvalidChars(withoutSeparators, [
    groupSeparator,
    decimalSeparator,
    ...abbreviations,
  ]);

  let valueOnly = withoutInvalidChars;

  if (!turnOffAbbreviations) {
    // disallow letter without number
    if (abbreviations.some((letter) => letter === withoutInvalidChars.toLowerCase())) {
      return '';
    }
    const parsed = parseAbbrValue(withoutInvalidChars, decimalSeparator);
    if (parsed) {
      valueOnly = String(parsed);
    }
  }

  const includeNegative = isNegative && allowNegativeValue ? '-' : '';

  if (String(valueOnly).includes(decimalSeparator)) {
    const [int, decimals] = withoutInvalidChars.split(decimalSeparator);
    const trimmedDecimals = decimalsLimit ? decimals.slice(0, decimalsLimit) : decimals;
    const includeDecimals = allowDecimals ? `${decimalSeparator}${trimmedDecimals}` : '';

    return `${includeNegative}${int}${includeDecimals}`;
  }

  return `${includeNegative}${valueOnly}`;
};
