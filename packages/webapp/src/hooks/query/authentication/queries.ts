import {
  signin,
  signinTwoFactor,
  signinTwoFactorSetup,
  signinTwoFactorSetupConfirm,
  mfaVerify,
  mfaPrepare,
  mfaSetupStart,
  mfaSetupConfirm,
  signup,
  signupConfirm,
  sendResetPassword,
  resetPassword,
  fetchAuthMeta,
  resendSignupConfirm,
  type AuthSigninResponse,
  type AuthSigninBody,
  type AuthSigninTwoFactorBody,
  type AuthSigninTwoFactorSetupBody,
  type AuthSigninTwoFactorSetupResponse,
  type AuthSigninTwoFactorSetupConfirmBody,
  type AuthSigninTwoFactorSetupConfirmResponse,
  type AuthMfaVerifyBody,
  type AuthMfaVerifyResponse,
  type AuthMfaPrepareBody,
  type AuthMfaPrepareResponse,
  type AuthMfaSetupStartBody,
  type AuthMfaSetupStartResponse,
  type AuthMfaSetupConfirmBody,
  type AuthMfaSetupConfirmResponse,
  type AuthSignupBody,
  type AuthSignupVerifyBody,
  type AuthSendResetPasswordBody,
  type AuthResetPasswordBody,
  type AuthMetaResponse,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import { batch } from 'react-redux';
import { setCookie } from '../../../utils';
import {
  useSetAuthToken,
  useSetAuthUserId,
  useSetOrganizationId,
} from '../../state';
import { useAuthApiFetcher, useApiFetcher } from '../../useRequest';
import { authenticationKeys } from './query-keys';

/**
 * The API wire format is snake_case; the SDK types are camelCase. Accept both
 * so the auth state keeps working when the camel-case middleware is enabled.
 */
type AuthSigninWire = AuthSigninResponse & {
  access_token?: string;
  user_id?: number;
  organization_id?: string;
  tenant_id?: number;
};

function readAuthSignin(data: AuthSigninResponse) {
  const wire = data as AuthSigninWire;

  return {
    accessToken: wire.access_token ?? wire.accessToken,
    userId: wire.user_id ?? wire.userId,
    organizationId: wire.organization_id ?? wire.organizationId,
    tenantId: wire.tenant_id ?? wire.tenantId,
  };
}

/**
 * Saves the response data to cookies.
 */
export function setAuthLoginCookies(
  data: AuthSigninResponse,
  rememberMe = false,
): void {
  const expiry = rememberMe ? 30 : 1;
  const auth = readAuthSignin(data);

  setCookie('token', auth.accessToken ?? '', expiry);
  setCookie('authenticated_user_id', String(auth.userId ?? ''), expiry);
  setCookie('organization_id', auth.organizationId ?? '', expiry);
  setCookie('tenant_id', String(auth.tenantId ?? ''), expiry);
}

/**
 * Stores a sign-in response (cookies and auth state): the user is signed in.
 */
export function useApplyAuthLogin() {
  const setAuthToken = useSetAuthToken();
  const setOrganizationId = useSetOrganizationId();
  const setUserId = useSetAuthUserId();

  return useCallback(
    (data: AuthSigninResponse, rememberMe = false) => {
      const auth = readAuthSignin(data);

      setAuthLoginCookies(data, rememberMe);
      batch(() => {
        setAuthToken(auth.accessToken ?? '');
        setOrganizationId(auth.organizationId ?? '');
        setUserId(String(auth.userId ?? ''));
      });
    },
    [setAuthToken, setOrganizationId, setUserId],
  );
}

/**
 * Whether a sign-in response is final (has a token) or asks for a second
 * step (two_factor_required / two_factor_setup_required).
 */
export function isAuthSigninComplete(data: AuthSigninResponse): boolean {
  return !!readAuthSignin(data).accessToken;
}

export function useAuthLogin(
  props?: UseMutationOptions<AuthSigninResponse, Error, AuthSigninBody>,
) {
  const fetcher = useAuthApiFetcher();
  const applyAuthLogin = useApplyAuthLogin();

  return useMutation({
    ...props,
    mutationFn: (values: AuthSigninBody) => signin(fetcher, values),
    onSuccess: (data, variables, context, mutation) => {
      // A two-factor step follows: nothing is stored until it is done.
      if (isAuthSigninComplete(data)) {
        applyAuthLogin(data, variables?.rememberMe);
      }
      props?.onSuccess?.(data, variables, context, mutation);
    },
  });
}

/**
 * Second sign-in step: a code or a recovery code with the challenge token.
 * The caller stores the response with `useApplyAuthLogin`.
 */
export function useAuthLoginTwoFactor(
  props?: UseMutationOptions<
    AuthSigninResponse,
    Error,
    AuthSigninTwoFactorBody
  >,
) {
  const fetcher = useAuthApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: AuthSigninTwoFactorBody) =>
      signinTwoFactor(fetcher, values),
  });
}

/**
 * Starts the two-factor setup the organization requires, during sign-in.
 */
export function useAuthTwoFactorSetupStart(
  props?: UseMutationOptions<
    AuthSigninTwoFactorSetupResponse,
    Error,
    AuthSigninTwoFactorSetupBody
  >,
) {
  const fetcher = useAuthApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: AuthSigninTwoFactorSetupBody) =>
      signinTwoFactorSetup(fetcher, values),
  });
}

/**
 * Confirms the required setup with a code: returns the sign-in response
 * plus the recovery codes. The caller stores it with `useApplyAuthLogin`
 * once the recovery codes were shown.
 */
export function useAuthTwoFactorSetupConfirm(
  props?: UseMutationOptions<
    AuthSigninTwoFactorSetupConfirmResponse,
    Error,
    AuthSigninTwoFactorSetupConfirmBody
  >,
) {
  const fetcher = useAuthApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: AuthSigninTwoFactorSetupConfirmBody) =>
      signinTwoFactorSetupConfirm(fetcher, values),
  });
}

/**
 * Generic second sign-in step: verify the credential of the selected method.
 * The caller stores the response with `useApplyAuthLogin`.
 */
export function useAuthMfaVerify(
  props?: UseMutationOptions<AuthMfaVerifyResponse, Error, AuthMfaVerifyBody>,
) {
  const fetcher = useAuthApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: AuthMfaVerifyBody) => mfaVerify(fetcher, values),
  });
}

/**
 * Prepares an MFA method before verification (email code, WebAuthn options).
 */
export function useAuthMfaPrepare(
  props?: UseMutationOptions<AuthMfaPrepareResponse, Error, AuthMfaPrepareBody>,
) {
  const fetcher = useAuthApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: AuthMfaPrepareBody) => mfaPrepare(fetcher, values),
  });
}

/**
 * Starts the setup of an MFA method during a setup-required sign-in.
 */
export function useAuthMfaSetupStart(
  props?: UseMutationOptions<
    AuthMfaSetupStartResponse,
    Error,
    AuthMfaSetupStartBody
  >,
) {
  const fetcher = useAuthApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: AuthMfaSetupStartBody) =>
      mfaSetupStart(fetcher, values),
  });
}

/**
 * Confirms the setup of an MFA method: returns the sign-in response plus the
 * recovery codes. The caller stores it with `useApplyAuthLogin` once the
 * recovery codes were shown.
 */
export function useAuthMfaSetupConfirm(
  props?: UseMutationOptions<
    AuthMfaSetupConfirmResponse,
    Error,
    AuthMfaSetupConfirmBody
  >,
) {
  const fetcher = useAuthApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: AuthMfaSetupConfirmBody) =>
      mfaSetupConfirm(fetcher, values),
  });
}

export function useAuthRegister(
  props?: UseMutationOptions<unknown, Error, AuthSignupBody>,
) {
  const fetcher = useAuthApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: AuthSignupBody) => signup(fetcher, values),
  });
}

export function useAuthSendResetPassword(
  props?: UseMutationOptions<unknown, Error, AuthSendResetPasswordBody>,
) {
  const fetcher = useAuthApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: AuthSendResetPasswordBody) =>
      sendResetPassword(fetcher, values),
  });
}

export function useAuthResetPassword(
  props?: UseMutationOptions<
    unknown,
    Error,
    [token: string, values: AuthResetPasswordBody]
  >,
) {
  const fetcher = useAuthApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([token, values]: [string, AuthResetPasswordBody]) =>
      resetPassword(fetcher, token, values),
  });
}

export function useAuthMetadata(
  props?: Omit<
    UseQueryOptions<AuthMetaResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useAuthApiFetcher();

  return useQuery({
    ...props,
    queryKey: authenticationKeys.metadata(),
    queryFn: () => fetchAuthMeta(fetcher),
  });
}

export function useAuthSignUpVerifyResendMail(
  props?: UseMutationOptions<void, Error, void>,
) {
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: () => resendSignupConfirm(fetcher),
  });
}

export function useAuthSignUpVerify(
  props?: UseMutationOptions<unknown, Error, AuthSignupVerifyBody>,
) {
  const fetcher = useAuthApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: AuthSignupVerifyBody) =>
      signupConfirm(fetcher, values),
  });
}
