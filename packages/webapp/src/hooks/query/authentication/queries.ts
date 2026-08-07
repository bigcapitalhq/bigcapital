import {
  signin,
  signup,
  signupConfirm,
  sendResetPassword,
  resetPassword,
  fetchAuthMeta,
  resendSignupConfirm,
  type AuthSigninResponse,
  type AuthSigninBody,
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
 * Saves the response data to cookies.
 */
export function setAuthLoginCookies(data: AuthSigninResponse): void {
  // @ts-ignore
  setCookie('token', data.access_token ?? '');
  // @ts-ignore
  setCookie('authenticated_user_id', String(data.user_id ?? ''));
  // @ts-ignore
  setCookie('organization_id', data.organization_id ?? '');
  // @ts-ignore
  setCookie('tenant_id', String(data.tenant_id ?? ''));
}

export function useAuthLogin(
  props?: UseMutationOptions<AuthSigninResponse, Error, AuthSigninBody>,
) {
  const fetcher = useAuthApiFetcher();
  const setAuthToken = useSetAuthToken();
  const setOrganizationId = useSetOrganizationId();
  const setUserId = useSetAuthUserId();

  return useMutation({
    ...props,
    mutationFn: (values: AuthSigninBody) => signin(fetcher, values),
    onSuccess: (data, variables, context, mutation) => {
      setAuthLoginCookies(data);
      batch(() => {
        // @ts-ignore
        setAuthToken(data.access_token ?? '');
        // @ts-ignore
        setOrganizationId(data.organization_id ?? '');
        // @ts-ignore
        setUserId(String(data.user_id ?? ''));
      });
      props?.onSuccess?.(data, variables, context, mutation);
    },
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
