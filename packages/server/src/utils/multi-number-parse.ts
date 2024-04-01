const validGrouping = (integerPart, sep) =>
  integerPart.split(sep).reduce((acc, group, idx) => {
    if (idx > 0) {
      return acc && group.length === 3;
    }

    return acc && group.length;
  }, true);

export const multiNumberParse = (number: number | string, standardDecSep = '.') => {
  // if it's a number already, this is going to be easy...
  if (typeof number === 'number') {
    return number;
  }

  // check validity of parameters
  if (!number || typeof number !== 'string') {
    throw new TypeError('number must be a string');
  }

  if (typeof standardDecSep !== 'string' || standardDecSep.length !== 1) {
    throw new TypeError('standardDecSep must be a single character string');
  }

  // check if negative
  const negative = number[0] === '-';

  // strip unnecessary chars
  const stripped = number
    // get rid of trailing non-numbers
    .replace(/[^\d]+$/, '')
    // get rid of the signal
    .slice(negative ? 1 : 0);

  // analyze separators
  const separators = (stripped.match(/[^\d]/g) || []).reduce(
    (acc, sep, idx) => {
      const sepChr = `str_${sep.codePointAt(0)}`;
      const cnt = ((acc[sepChr] || {}).cnt || 0) + 1;

      return {
        ...acc,
        [sepChr]: {
          sep,
          cnt,
          lastIdx: idx,
        },
      };
    },
    {}
  );

  // check correctness of separators
  const sepKeys = Object.keys(separators);

  if (!sepKeys.length) {
    // no separator, that's easy-peasy
    return parseInt(stripped, 10) * (negative ? -1 : 1);
  }

  if (sepKeys.length > 2) {
    // there's more than 2 separators, that's wrong
    return Number.NaN;
  }

  if (sepKeys.length > 1) {
    // there's two separators, that's ok by now
    let sep1 = separators[sepKeys[0]];
    let sep2 = separators[sepKeys[1]];

    if (sep1.lastIdx > sep2.lastIdx) {
      // swap
      [sep1, sep2] = [sep2, sep1];
    }

    // if more than one separator appears more than once, that's wrong
    if (sep1.cnt > 1 && sep2.cnt > 1) {
      return Number.NaN;
    }

    // check if the last separator is the single one
    if (sep2.cnt > 1) {
      return Number.NaN;
    }

    // check the groupings
    const [integerPart] = stripped.split(sep2.sep);

    if (!validGrouping(integerPart, sep1.sep)) {
      return Number.NaN;
    }

    // ok, we got here! let's handle it
    return (
      parseFloat(stripped.split(sep1.sep).join('').replace(sep2.sep, '.')) *
      (negative ? -1 : 1)
    );
  }

  // ok, only one separator, which is nice
  const sep = separators[sepKeys[0]];

  if (sep.cnt > 1) {
    // there's more than one separator, which means it's integer
    // let's check the groupings
    if (!validGrouping(stripped, sep.sep)) {
      return Number.NaN;
    }

    // it's valid, let's return an integer
    return parseInt(stripped.split(sep.sep).join(''), 10) * (negative ? -1 : 1);
  }

  // just one separator, let's check last group
  const groups = stripped.split(sep.sep);

  if (groups[groups.length - 1].length === 3) {
    // ok, we're in ambiguous territory here

    if (sep.sep !== standardDecSep) {
      // it's an integer
      return (
        parseInt(stripped.split(sep.sep).join(''), 10) * (negative ? -1 : 1)
      );
    }
  }

  // well, it looks like it's a simple float
  return parseFloat(stripped.replace(sep.sep, '.')) * (negative ? -1 : 1);
};
