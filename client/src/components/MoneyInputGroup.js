import React, {useState, useMemo, useEffect, useCallback} from 'react';
import {InputGroup} from '@blueprintjs/core';

const joinIntegerAndDecimal = (integer, decimal, separator) => {
  let output = `${integer}`;

  if (separator) {
    output += separator;
    output += decimal ? decimal : '';
  }
  return output;
};

const hasSeparator = (input, separator) => {
  return -1 !== input.indexOf(separator);
};

const addThousandSeparator = (integer, separator) => {
  return integer.replace(/(\d)(?=(?:\d{3})+\b)/gm, `$1${separator}`)
};

const toString = (number) => `${number}`;

const onlyNumbers = (input) => {
  return toString(input).replace(/\D+/g, '') || '0'
};

const formatter = (value, options) => {
  const input = toString(value);
  const navigate = input.indexOf('-') >= 0 ? '-' : '';
  const parts = toString(input).split(options.decimal);
  const integer = parseInt(onlyNumbers(parts[0]), 10);
  const decimal = parts[1] ? onlyNumbers(parts[1]) : null;
  const integerThousand = addThousandSeparator(toString(integer), options.thousands);
  const separator = hasSeparator(input, options.decimal)
    ? options.decimal : false;

  return `${navigate}${options.prefix}${joinIntegerAndDecimal(integerThousand, decimal, separator)}${options.suffix}`;
};

const unformatter = (input, options) => {
  const navigate = input.indexOf('-') >= 0 ? '-' : '';
  const parts = toString(input).split(options.decimal);
  const integer = parseInt(onlyNumbers(parts[0]), 10);
  const decimal = parts[1] ? onlyNumbers(parts[1]) : null;
  const separator = hasSeparator(input, options.decimal)
    ? options.decimal : false;

  return `${navigate}${joinIntegerAndDecimal(integer, decimal, separator)}`;
};


export default function MoneyFieldGroup({
  value,
  prefix = '',
  suffix = '',
  thousands = ',',
  decimal = '.',
  precision = 2,
  inputGroupProps,
  onChange,
}) {
  const [state, setState] = useState(value);

  const options = useMemo(() => ({
    prefix, suffix, thousands, decimal, precision,
  }), [
    prefix, suffix, thousands, decimal, precision,
  ]);

  const handleChange = useCallback((event) => {
    const formatted = formatter(event.target.value, options);
    const value = unformatter(event.target.value, options);

    setState(formatted);
    onChange && onChange(event, value);
  }, [onChange, options]);

  useEffect(() => {
    const formatted = formatter(value, options);
    setState(formatted)
  }, [value, options, setState]);

  return (
   <InputGroup
      value={state}
      onChange={handleChange}
      {...inputGroupProps} />
  );
}