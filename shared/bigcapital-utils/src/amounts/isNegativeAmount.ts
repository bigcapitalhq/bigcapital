// An optional symbol with no digits, spaces, parentheses, angle brackets or
// minus ("$", "AED", "Bs.F.", "%"), digits with "," / "." separators, and an
// optional trailing "%".
const AMOUNT = String.raw`[^\d\s()<>-]*\d[\d,.]*%?`;

// A whole amount with a leading minus ("-$1,200.00") or wrapped in
// parentheses ("($1,200.00)"), the two negative formats the server emits.
const NEGATIVE_AMOUNT = new RegExp(String.raw`^(?:-${AMOUNT}|\(${AMOUNT}\))$`);

/**
 * Detects whether the given value is a negative amount.
 *
 * Report table cells hold amounts the server has already formatted, so a
 * string counts only when the whole trimmed value is a formatted amount with
 * a negative sign. That keeps text such as "(Inactive) Account 2" or
 * "Total (net)" out. An amount that rounds to zero ("-0.00") is not negative.
 * @param {unknown} value - A number or a formatted amount.
 * @returns {boolean}
 */
export const isNegativeAmount = (value: unknown): boolean => {
  if (typeof value === 'number') {
    return value < 0;
  }
  if (typeof value !== 'string') {
    return false;
  }
  const trimmed = value.trim();

  return NEGATIVE_AMOUNT.test(trimmed) && /[1-9]/.test(trimmed);
};
