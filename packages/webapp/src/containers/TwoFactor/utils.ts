import intl from 'react-intl-universal';

export const TWO_FACTOR_ERROR_TYPES = {
  CODE_INVALID: 'TWO_FACTOR_CODE_INVALID',
  VERIFICATION_FAILED: 'TWO_FACTOR_VERIFICATION_FAILED',
  CHALLENGE_INVALID: 'TWO_FACTOR_CHALLENGE_INVALID',
  TOO_MANY_ATTEMPTS: 'TWO_FACTOR_TOO_MANY_ATTEMPTS',
  SETUP_NOT_STARTED: 'TWO_FACTOR_SETUP_NOT_STARTED',
  ALREADY_ENABLED: 'TWO_FACTOR_ALREADY_ENABLED',
  ENABLE_OWN_FIRST: 'TWO_FACTOR_ENABLE_OWN_FIRST',
} as const;

/**
 * The error type of a failed two-factor request: sign-in errors carry
 * `code`, the others `errors[0].type`.
 */
export function getTwoFactorErrorType(error: unknown): string | undefined {
  const data = (error as { data?: any })?.data;
  if ((error as { status?: number })?.status === 429 && !data?.code) {
    return TWO_FACTOR_ERROR_TYPES.TOO_MANY_ATTEMPTS;
  }
  return data?.code ?? data?.errors?.[0]?.type;
}

/**
 * A user-facing message for a two-factor error.
 */
export function getTwoFactorErrorMessage(error: unknown): string {
  switch (getTwoFactorErrorType(error)) {
    case TWO_FACTOR_ERROR_TYPES.CODE_INVALID:
      return intl.get('two_factor.error.code_invalid');
    case TWO_FACTOR_ERROR_TYPES.VERIFICATION_FAILED:
      return intl.get('two_factor.error.verification_failed');
    case TWO_FACTOR_ERROR_TYPES.CHALLENGE_INVALID:
      return intl.get('two_factor.error.challenge_invalid');
    case TWO_FACTOR_ERROR_TYPES.TOO_MANY_ATTEMPTS:
      return intl.get('two_factor.error.too_many_attempts');
    case TWO_FACTOR_ERROR_TYPES.SETUP_NOT_STARTED:
      return intl.get('two_factor.error.setup_expired');
    case TWO_FACTOR_ERROR_TYPES.ENABLE_OWN_FIRST:
      return intl.get('two_factor.error.enable_own_first');
    default:
      return intl.get('something_wrong');
  }
}

/**
 * Keeps digits only, for the 6-digit code field.
 */
export const normalizeCodeInput = (value: string) =>
  String(value ?? '').replace(/\D/g, '').slice(0, 6);
