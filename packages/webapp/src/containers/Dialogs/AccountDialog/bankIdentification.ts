/**
 * Bank account identification rules for organizations located in countries that
 * use local banking identifiers, mirroring the server-side validation in
 * `modules/Accounts/utils/BankAccountIdentification.ts`.
 */

/** Countries whose bank accounts carry extra identification fields. */
export const BANK_IDENTIFICATION_COUNTRIES = ['BR', 'AR'];

/** Only real bank accounts carry these fields. */
export const BANK_IDENTIFICATION_ACCOUNT_TYPES = ['bank'];

/** Brazilian COMPE bank code: exactly three digits. */
export const BANK_CODE_REGEX = /^\d{3}$/;

/** Brazilian branch (agência) number: one to five digits. */
export const AGENCY_NUMBER_REGEX = /^\d{1,5}$/;

/**
 * Brazilian account number with a trailing check digit, optionally hyphenated.
 * Shape only - Brazilian banks do not share one check digit algorithm, so
 * verifying it arithmetically would reject valid accounts.
 */
export const ACCOUNT_NUMBER_REGEX = /^\d{1,18}-?[\dxX]$/;

/** Argentine CBU: exactly 22 digits. */
export const CBU_REGEX = /^\d{22}$/;

export const normalizeLocation = (location?: string | null): string =>
  (location || '').toUpperCase();

export const isBankIdentificationCountry = (location?: string | null): boolean =>
  BANK_IDENTIFICATION_COUNTRIES.includes(normalizeLocation(location));

export const isBankIdentificationAccountType = (
  accountType?: string | null,
): boolean =>
  !!accountType && BANK_IDENTIFICATION_ACCOUNT_TYPES.includes(accountType);

/**
 * Validates an Argentine CBU including both check digits. The first block is
 * bank code (3), branch (4) and a check digit; the second is the account (13)
 * and a check digit. Each is the complement to ten of the last digit of a
 * weighted sum over the preceding digits.
 */
export const isValidCbu = (cbu?: string | null): boolean => {
  if (!cbu || !CBU_REGEX.test(cbu)) return false;

  const digits = cbu.split('').map(Number);
  const checkDigit = (values: number[], weights: number[]): number =>
    (10 - (values.reduce((t, v, i) => t + v * weights[i], 0) % 10)) % 10;

  return (
    checkDigit(digits.slice(0, 7), [7, 1, 3, 9, 7, 1, 3]) === digits[7] &&
    checkDigit(digits.slice(8, 21), [3, 9, 7, 1, 3, 9, 7, 1, 3, 9, 7, 1, 3]) ===
      digits[21]
  );
};
