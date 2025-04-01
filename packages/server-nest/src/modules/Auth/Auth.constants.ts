export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};

export const ERRORS = {
  INVALID_DETAILS: 'INVALID_DETAILS',
  USER_INACTIVE: 'USER_INACTIVE',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  TOKEN_INVALID: 'TOKEN_INVALID',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  PHONE_NUMBER_EXISTS: 'PHONE_NUMBER_EXISTS',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  SIGNUP_RESTRICTED_NOT_ALLOWED: 'SIGNUP_RESTRICTED_NOT_ALLOWED',
  SIGNUP_RESTRICTED: 'SIGNUP_RESTRICTED',
  SIGNUP_CONFIRM_TOKEN_INVALID: 'SIGNUP_CONFIRM_TOKEN_INVALID',
  USER_ALREADY_VERIFIED: 'USER_ALREADY_VERIFIED',
};

export const IS_PUBLIC_ROUTE = 'isPublic';

export const SendResetPasswordMailQueue = 'SendResetPasswordMailQueue';
export const SendResetPasswordMailJob = 'SendResetPasswordMailJob';

export const SendSignupVerificationMailQueue =
  'SendSignupVerificationMailQueue';
export const SendSignupVerificationMailJob = 'SendSignupVerificationMailJob';
