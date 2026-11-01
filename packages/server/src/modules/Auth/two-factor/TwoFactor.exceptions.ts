import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { TWO_FACTOR_ERRORS } from './TwoFactor.constants';

/**
 * Same body shape as the sign-in errors (`InvalidEmailPasswordException`),
 * so clients read `code` the same way in both steps.
 */
const body = (
  statusCode: number,
  error: string,
  message: string,
  code: string,
) => ({
  statusCode,
  error,
  message,
  code,
  errors: [{ type: code, message }],
});

/**
 * The challenge token is unknown, expired, already used or out of attempts:
 * the client has to sign in with the password again.
 */
export class TwoFactorChallengeInvalidException extends UnauthorizedException {
  constructor() {
    super(
      body(
        401,
        'Unauthorized',
        'The sign-in has expired, sign in again.',
        TWO_FACTOR_ERRORS.CHALLENGE_INVALID,
      ),
    );
  }
}

/**
 * Wrong, reused or already used code. Deliberately one error for all cases.
 */
export class TwoFactorCodeInvalidException extends UnauthorizedException {
  constructor() {
    super(
      body(
        401,
        'Unauthorized',
        'The authentication code is not correct.',
        TWO_FACTOR_ERRORS.CODE_INVALID,
      ),
    );
  }
}

/**
 * Too many wrong codes for this user lately.
 */
export class TwoFactorTooManyAttemptsException extends HttpException {
  constructor() {
    super(
      body(
        429,
        'Too Many Requests',
        'Too many wrong authentication codes, try again later.',
        TWO_FACTOR_ERRORS.TOO_MANY_ATTEMPTS,
      ),
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}

/**
 * The organization requires two-factor authentication and the signed-in user
 * has not set it up: the session has to sign in again (and set it up then).
 */
export class TwoFactorSetupRequiredException extends UnauthorizedException {
  constructor() {
    super(
      body(
        401,
        'Unauthorized',
        'Your organization requires two-factor authentication. Sign in again to set it up.',
        TWO_FACTOR_ERRORS.SETUP_REQUIRED,
      ),
    );
  }
}
