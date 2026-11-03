import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpRequestBody, OpResponseBody } from './utils';

// All auth routes (schema paths). After running generate:sdk-types, these match the OpenAPI spec.
export const AUTH_ROUTES = {
  ACCOUNT: '/api/auth/account',
  RESEND_SIGNUP: '/api/auth/signup/verify/resend',
  SIGNIN: '/api/auth/signin',
  SIGNIN_TWO_FACTOR: '/api/auth/signin/2fa',
  SIGNIN_TWO_FACTOR_SETUP: '/api/auth/signin/2fa/setup',
  SIGNIN_TWO_FACTOR_SETUP_CONFIRM: '/api/auth/signin/2fa/setup/confirm',
  SIGNUP: '/api/auth/signup',
  SIGNUP_VERIFY: '/api/auth/signup/verify',
  SEND_RESET_PASSWORD: '/api/auth/send_reset_password',
  RESET_PASSWORD: '/api/auth/reset_password/{token}',
  META: '/api/auth/meta',
} as const satisfies Record<string, keyof paths>;

// Schema-derived types (from paths/operations). No manual interfaces.
export type AuthedAccount = OpResponseBody<
  OpForPath<typeof AUTH_ROUTES.ACCOUNT, 'get'>
>;

export type ResendSignupConfirmBody = OpRequestBody<
  OpForPath<typeof AUTH_ROUTES.RESEND_SIGNUP, 'post'>
>;

export type AuthSigninBody = OpRequestBody<
  OpForPath<typeof AUTH_ROUTES.SIGNIN, 'post'>
>;
export type AuthSigninResponse = OpResponseBody<
  OpForPath<typeof AUTH_ROUTES.SIGNIN, 'post'>
>;

export type AuthSigninTwoFactorBody = OpRequestBody<
  OpForPath<typeof AUTH_ROUTES.SIGNIN_TWO_FACTOR, 'post'>
>;
export type AuthSigninTwoFactorSetupBody = OpRequestBody<
  OpForPath<typeof AUTH_ROUTES.SIGNIN_TWO_FACTOR_SETUP, 'post'>
>;
export type AuthSigninTwoFactorSetupResponse = OpResponseBody<
  OpForPath<typeof AUTH_ROUTES.SIGNIN_TWO_FACTOR_SETUP, 'post'>
>;
export type AuthSigninTwoFactorSetupConfirmBody = OpRequestBody<
  OpForPath<typeof AUTH_ROUTES.SIGNIN_TWO_FACTOR_SETUP_CONFIRM, 'post'>
>;
export type AuthSigninTwoFactorSetupConfirmResponse = OpResponseBody<
  OpForPath<typeof AUTH_ROUTES.SIGNIN_TWO_FACTOR_SETUP_CONFIRM, 'post'>
>;

export type AuthSignupBody = OpRequestBody<
  OpForPath<typeof AUTH_ROUTES.SIGNUP, 'post'>
>;

export type AuthSignupVerifyBody = OpRequestBody<
  OpForPath<typeof AUTH_ROUTES.SIGNUP_VERIFY, 'post'>
>;

export type AuthSendResetPasswordBody = OpRequestBody<
  OpForPath<typeof AUTH_ROUTES.SEND_RESET_PASSWORD, 'post'>
>;

export type AuthResetPasswordBody = OpRequestBody<
  OpForPath<typeof AUTH_ROUTES.RESET_PASSWORD, 'post'>
>;

export type AuthMetaResponse = OpResponseBody<
  OpForPath<typeof AUTH_ROUTES.META, 'get'>
>;

/**
 * Fetches the authenticated account (requires auth token).
 */
export async function fetchAuthedAccount(
  fetcher: ApiFetcher
): Promise<AuthedAccount> {
  const get = fetcher.path(AUTH_ROUTES.ACCOUNT).method('get').create();
  const { data } = await get({});
  return data as AuthedAccount;
}

/**
 * Resends the signup confirmation message.
 */
export async function resendSignupConfirm(
  fetcher: ApiFetcher,
  body?: ResendSignupConfirmBody
): Promise<void> {
  const post = fetcher.path(AUTH_ROUTES.RESEND_SIGNUP).method('post').create();
  await post(body ?? ({} as ResendSignupConfirmBody));
}

/**
 * Sign in with email and password.
 */
export async function signin(
  fetcher: ApiFetcher,
  body: AuthSigninBody
): Promise<AuthSigninResponse> {
  const post = fetcher.path(AUTH_ROUTES.SIGNIN).method('post').create();
  const { data } = await post(body as never);
  return data as AuthSigninResponse;
}

/**
 * Second sign-in step: a code from the authenticator app or a recovery code,
 * with the challenge token returned by `signin`.
 */
export async function signinTwoFactor(
  fetcher: ApiFetcher,
  body: AuthSigninTwoFactorBody
): Promise<AuthSigninResponse> {
  const post = fetcher
    .path(AUTH_ROUTES.SIGNIN_TWO_FACTOR)
    .method('post')
    .create();
  const { data } = await post(body as never);
  return data as AuthSigninResponse;
}

/**
 * Starts the two-factor setup the organization requires, during sign-in.
 */
export async function signinTwoFactorSetup(
  fetcher: ApiFetcher,
  body: AuthSigninTwoFactorSetupBody
): Promise<AuthSigninTwoFactorSetupResponse> {
  const post = fetcher
    .path(AUTH_ROUTES.SIGNIN_TWO_FACTOR_SETUP)
    .method('post')
    .create();
  const { data } = await post(body as never);
  return data as AuthSigninTwoFactorSetupResponse;
}

/**
 * Confirms the required two-factor setup with a code and signs in.
 */
export async function signinTwoFactorSetupConfirm(
  fetcher: ApiFetcher,
  body: AuthSigninTwoFactorSetupConfirmBody
): Promise<AuthSigninTwoFactorSetupConfirmResponse> {
  const post = fetcher
    .path(AUTH_ROUTES.SIGNIN_TWO_FACTOR_SETUP_CONFIRM)
    .method('post')
    .create();
  const { data } = await post(body as never);
  return data as AuthSigninTwoFactorSetupConfirmResponse;
}

/**
 * Sign up a new user.
 */
export async function signup(
  fetcher: ApiFetcher,
  body: AuthSignupBody
): Promise<unknown> {
  const post = fetcher.path(AUTH_ROUTES.SIGNUP).method('post').create();
  const { data } = await post(body as never);
  return data;
}

/**
 * Confirm user signup with email and token.
 */
export async function signupConfirm(
  fetcher: ApiFetcher,
  body: AuthSignupVerifyBody
): Promise<unknown> {
  const post = fetcher
    .path(AUTH_ROUTES.SIGNUP_VERIFY)
    .method('post')
    .create();
  const { data } = await post(body as never);
  return data;
}

/**
 * Send reset password email.
 */
export async function sendResetPassword(
  fetcher: ApiFetcher,
  body: AuthSendResetPasswordBody
): Promise<unknown> {
  const post = fetcher
    .path(AUTH_ROUTES.SEND_RESET_PASSWORD)
    .method('post')
    .create();
  const { data } = await post(body as never);
  return data;
}

/**
 * Reset password using token (from email link).
 */
export async function resetPassword(
  fetcher: ApiFetcher,
  token: string,
  body: AuthResetPasswordBody
): Promise<unknown> {
  const post = fetcher
    .path(AUTH_ROUTES.RESET_PASSWORD)
    .method('post')
    .create();
  const { data } = await post({ token, ...(body as object) } as never);
  return data;
}

/**
 * Get auth metadata (e.g. for login page).
 */
export async function fetchAuthMeta(
  fetcher: ApiFetcher
): Promise<AuthMetaResponse> {
  const get = fetcher.path(AUTH_ROUTES.META).method('get').create();
  const { data } = await get({});
  return data as AuthMetaResponse;
}
