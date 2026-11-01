import { SetMetadata } from '@nestjs/common';

export const TWO_FACTOR_ERRORS = {
  ALREADY_ENABLED: 'TWO_FACTOR_ALREADY_ENABLED',
  NOT_ENABLED: 'TWO_FACTOR_NOT_ENABLED',
  SETUP_NOT_STARTED: 'TWO_FACTOR_SETUP_NOT_STARTED',
  CODE_INVALID: 'TWO_FACTOR_CODE_INVALID',
  VERIFICATION_FAILED: 'TWO_FACTOR_VERIFICATION_FAILED',
  CHALLENGE_INVALID: 'TWO_FACTOR_CHALLENGE_INVALID',
  TOO_MANY_ATTEMPTS: 'TWO_FACTOR_TOO_MANY_ATTEMPTS',
  SETUP_REQUIRED: 'TWO_FACTOR_SETUP_REQUIRED',
  API_KEY_NOT_ALLOWED: 'TWO_FACTOR_API_KEY_NOT_ALLOWED',
  ENABLE_OWN_FIRST: 'TWO_FACTOR_ENABLE_OWN_FIRST',
} as const;

/**
 * Lifetime of a sign-in challenge in seconds: entering a code, or setting up
 * an authenticator app when the organization requires two-factor.
 */
export const TWO_FACTOR_CHALLENGE_TTL_SECONDS = {
  verify: 5 * 60,
  setup: 10 * 60,
} as const;

/**
 * Codes that may be tried against one sign-in challenge.
 */
export const TWO_FACTOR_MAX_ATTEMPTS_PER_CHALLENGE = 5;

/**
 * Failed codes allowed per user across all challenges within the window
 * below; beyond that the second step answers 429 until the window passes.
 */
export const TWO_FACTOR_MAX_FAILED_ATTEMPTS_PER_USER = 10;
export const TWO_FACTOR_FAILED_ATTEMPTS_WINDOW_SECONDS = 15 * 60;

/**
 * An unconfirmed setup (secret shown, no code entered yet) expires after this.
 */
export const TWO_FACTOR_PENDING_SETUP_TTL_SECONDS = 30 * 60;

/**
 * Routes that a signed-in user may call even when the organization requires
 * two-factor authentication and the user has not set it up yet.
 */
export const IS_ALLOWED_WITHOUT_TWO_FACTOR = 'IS_ALLOWED_WITHOUT_TWO_FACTOR';
export const AllowWithoutTwoFactor = () =>
  SetMetadata(IS_ALLOWED_WITHOUT_TWO_FACTOR, true);
