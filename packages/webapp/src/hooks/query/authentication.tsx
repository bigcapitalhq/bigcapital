// @ts-nocheck
import { useMutation } from 'react-query';
import { batch } from 'react-redux';
import useApiRequest, { useAuthApiRequest } from '../useRequest';
import { setCookie } from '../../utils';
import { useRequestQuery } from '../useQueryRequest';
import t from './types';
import {
  useSetAuthToken,
  useSetAuthUserId,
  useSetLocale,
  useSetOrganizationId,
  useSetTenantId,
} from '../state';

const AuthRoute = {
  Signin: 'auth/signin',
  Signup: 'auth/signup',
  SignupVerify: 'auth/signup/verify',
  SignupVerifyResend: 'auth/signup/verify/resend',
  SendResetPassword: 'auth/send_reset_password',
  ForgetPassword: 'auth/reset_password/:token',
  AuthMeta: 'auth/meta',
};

/**
 * Saves the response data to cookies.
 */
export function setAuthLoginCookies(data) {
  setCookie('token', data.access_token);
  setCookie('authenticated_user_id', data.user_id);
  setCookie('organization_id', data.organization_id);
  setCookie('tenant_id', data.tenant_id);

  // if (data?.tenant?.metadata?.language)
  //   setCookie('locale', data.tenant.metadata.language);
}

/**
 * Authentication login.
 */
export const useAuthLogin = (props) => {
  const apiRequest = useAuthApiRequest();

  const setAuthToken = useSetAuthToken();
  const setOrganizationId = useSetOrganizationId();
  const setUserId = useSetAuthUserId();
  const setTenantId = useSetTenantId();
  const setLocale = useSetLocale();

  return useMutation((values) => apiRequest.post(AuthRoute.Signin, values), {
    onSuccess: (res) => {
      // Set authentication cookies.
      setAuthLoginCookies(res.data);

      batch(() => {
        // Sets the auth metadata to global state.
        setAuthToken(res.data.access_token);
        setOrganizationId(res.data.organization_id);
        setTenantId(res.data.tenant_id);
        setUserId(res.data.user_id);

        // if (res.data?.tenant?.metadata?.language) {
        //   setLocale(res.data?.tenant?.metadata?.language);
        // }
      });
      props?.onSuccess && props?.onSuccess(...args);
    },
    ...props,
  });
};

/**
 * Authentication register.
 */
export const useAuthRegister = (props) => {
  const apiRequest = useAuthApiRequest();

  return useMutation(
    (values) => apiRequest.post(AuthRoute.Signup, values),
    props,
  );
};

/**
 * Authentication send reset password.
 */
export const useAuthSendResetPassword = (props) => {
  const apiRequest = useAuthApiRequest();

  return useMutation(
    (values) => apiRequest.post(AuthRoute.SendResetPassword, values),
    props,
  );
};

/**
 * Authentication reset password.
 */
export const useAuthResetPassword = (props) => {
  const apiRequest = useAuthApiRequest();

  return useMutation(
    ([token, values]) => apiRequest.post(`auth/reset/${token}`, values),
    props,
  );
};

/**
 * Fetches the authentication page metadata.
 */
export const useAuthMetadata = (props = {}) => {
  return useRequestQuery(
    [t.AUTH_METADATA_PAGE],
    {
      method: 'get',
      url: AuthRoute.AuthMeta,
    },
    {
      select: (res) => res.data,
      defaultData: {},
      ...props,
    },
  );
};

/**
 * Resend the mail of signup verification.
 */
export const useAuthSignUpVerifyResendMail = (props) => {
  const apiRequest = useAuthApiRequest();

  return useMutation(
    () => apiRequest.post(AuthRoute.SignupVerifyResend),
    props,
  );
};

interface AuthSignUpVerifyValues {
  token: string;
  email: string;
}

/**
 * Signup verification.
 */
export const useAuthSignUpVerify = (props) => {
  const apiRequest = useAuthApiRequest();

  return useMutation(
    (values: AuthSignUpVerifyValues) =>
      apiRequest.post(AuthRoute.SignupVerify, values),
    props,
  );
};
