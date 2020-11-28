export const padTrimValue = (value: string, decimalSeparator = '.', precision?: number): string => {
  if (!precision || value === '' || value === undefined) {
    return value;
  }

  if (!value.match(/\d/g)) {
    return '';
  }

  const [int, decimals] = value.split(decimalSeparator);
  let newValue = decimals || '';

  if (newValue.length < precision) {
    while (newValue.length < precision) {
      newValue += '0';
    }
  } else {
    newValue = newValue.slice(0, precision);
  }

  return `${int}${decimalSeparator}${newValue}`;
};
