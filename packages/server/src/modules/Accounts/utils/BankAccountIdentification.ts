/**
 * Bank account identification rules for organizations located in countries
 * where local banking identifiers are needed alongside the account name.
 */

/**
 * Countries whose bank accounts carry extra identification fields.
 */
export const BANK_IDENTIFICATION_COUNTRIES = ['BR', 'AR'] as const;

export type BankIdentificationCountry =
  (typeof BANK_IDENTIFICATION_COUNTRIES)[number];

/**
 * Account types the identification fields apply to. The fields describe a real
 * bank account, so they are not asked for on cash, equity or expense accounts.
 */
export const BANK_IDENTIFICATION_ACCOUNT_TYPES = ['bank'];

/** Brazilian COMPE bank code: exactly three digits. */
export const BANK_CODE_REGEX = /^\d{3}$/;

/** Brazilian branch (agência) number: one to five digits. */
export const AGENCY_NUMBER_REGEX = /^\d{1,5}$/;

/**
 * Brazilian account number carrying a trailing check digit, with an optional
 * hyphen before it, e.g. "12345678-9" or "123456789".
 *
 * The check digit is only validated for shape, not arithmetic. Brazilian banks
 * do not share a single algorithm - Banco do Brasil, Itaú, Bradesco and Caixa
 * each compute it differently - so verifying it generically would reject
 * genuinely valid accounts.
 */
export const ACCOUNT_NUMBER_REGEX = /^\d{1,18}-?[\dxX]$/;

/** Argentine CBU: exactly 22 digits. */
export const CBU_REGEX = /^\d{22}$/;

/**
 * Returns true if the given country requires bank identification fields.
 */
export const isBankIdentificationCountry = (
  location: string | null | undefined,
): boolean =>
  !!location &&
  (BANK_IDENTIFICATION_COUNTRIES as readonly string[]).includes(
    location.toUpperCase(),
  );

/**
 * Returns true if the given account type carries bank identification fields.
 */
export const isBankIdentificationAccountType = (
  accountType: string | null | undefined,
): boolean =>
  !!accountType && BANK_IDENTIFICATION_ACCOUNT_TYPES.includes(accountType);

/**
 * Validates an Argentine CBU, including both of its check digits.
 *
 * A CBU is two blocks. The first is eight digits - bank code (3), branch (4)
 * and a check digit. The second is fourteen digits - the account (13) and a
 * check digit. Each check digit is the complement to ten of the last digit of
 * a weighted sum over the digits preceding it.
 */
export const isValidCbu = (cbu: string | null | undefined): boolean => {
  if (!cbu || !CBU_REGEX.test(cbu)) {
    return false;
  }
  const digits = cbu.split('').map(Number);

  const checkDigit = (values: number[], weights: number[]): number => {
    const sum = values.reduce(
      (total, value, index) => total + value * weights[index],
      0,
    );
    return (10 - (sum % 10)) % 10;
  };
  const firstBlockValid =
    checkDigit(digits.slice(0, 7), [7, 1, 3, 9, 7, 1, 3]) === digits[7];

  const secondBlockValid =
    checkDigit(
      digits.slice(8, 21),
      [3, 9, 7, 1, 3, 9, 7, 1, 3, 9, 7, 1, 3],
    ) === digits[21];

  return firstBlockValid && secondBlockValid;
};
