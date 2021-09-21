import { addSeparators } from './addSeparators';

type Props = {
  /**
   * Value to format
   */
  value: number | string | undefined;

  /**
   * Decimal separator
   *
   * Default = '.'
   */
  decimalSeparator?: string;

  /**
   * Group separator
   *
   * Default = ','
   */
  groupSeparator?: string;

  /**
   * Turn off separators
   *
   * This will override Group separators
   *
   * Default = false
   */
  turnOffSeparators?: boolean;

  /**
   * Prefix
   */
  prefix?: string;
};

/**
 * Format value with decimal separator, group separator and prefix
 */
export const formatValue = (props: Props): string => {
  const {
    value: _value,
    groupSeparator = ',',
    decimalSeparator = '.',
    turnOffSeparators = false,
    prefix,
  } = props;

  if (_value === '' || _value === undefined) {
    return '';
  }

  const value = String(_value);

  if (value === '-') {
    return '-';
  }

  const isNegative = RegExp('^-\\d+').test(value);
  const hasDecimalSeparator = decimalSeparator && value.includes(decimalSeparator);

  const valueOnly = isNegative ? value.replace('-', '') : value;
  const [int, decimals] = hasDecimalSeparator ? valueOnly.split(decimalSeparator) : [valueOnly];

  const formattedInt = turnOffSeparators ? int : addSeparators(int, groupSeparator);

  const includePrefix = prefix ? prefix : '';
  const includeNegative = isNegative ? '-' : '';
  const includeDecimals =
    hasDecimalSeparator && decimals
      ? `${decimalSeparator}${decimals}`
      : hasDecimalSeparator
      ? `${decimalSeparator}`
      : '';

  return `${includeNegative}${includePrefix}${formattedInt}${includeDecimals}`;
};
