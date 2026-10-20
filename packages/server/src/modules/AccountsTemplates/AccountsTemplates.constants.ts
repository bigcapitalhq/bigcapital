export const ERRORS = {
  TEMPLATE_NOT_FOUND: 'ACCOUNTS_TEMPLATE_NOT_FOUND',
  TEMPLATE_VARIANT_NOT_FOUND: 'ACCOUNTS_TEMPLATE_VARIANT_NOT_FOUND',
  TEMPLATE_CANNOT_BE_APPLIED: 'ACCOUNTS_TEMPLATE_CANNOT_BE_APPLIED',
};

/**
 * Seeded accounts that are not predefined but are still looked up by slug:
 * customer opening balances post to `other-income`, and the Stripe integration
 * defaults its deposit account to `bank-account`. A template may renumber them
 * but never remove them.
 */
export const PROTECTED_SLUGS = ['other-income', 'bank-account'];

/**
 * Account code length accepted by the account DTOs.
 */
export const ACCOUNT_CODE_MIN_LENGTH = 3;
export const ACCOUNT_CODE_MAX_LENGTH = 6;
