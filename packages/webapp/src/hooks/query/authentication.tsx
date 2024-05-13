// @ts-nocheck
import { useMutation } from 'react-query';
import useApiRequest from '../useRequest';
import { setCookie } from '../../utils';
import { useRequestQuery } from '../useQueryRequest';
import t from './types';
import { useAuthActions } from '@/hooks/state'

/**
 * Saves the response data to cookies.
 */
function setAuthLoginCookies(data) {
  setCookie('token', data.token);
  setCookie('authenticated_user_id', data.user.id);
  setCookie('organization_id', data.tenant.organization_id);
  setCookie('tenant_id', data.tenant.id);

  if (data?.tenant?.metadata?.language)
    setCookie('locale', data.tenant.metadata.language);
}

/**
 * Authentication login.
 */
export const useAuthLogin = (props) => {
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('auth/login', values), {
    select: (res) => res.data,
    onSuccess: (data) => {
      // Set authentication cookies.
      setAuthLoginCookies(data.data);

      // Reboot the application.
      window.location.reload();
    },
    ...props,
  });
};


/**
 * Authentication OIDC authorize
 */

export const useAuthOidcAuthorize = (props) => {
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('oidc/authorize', values), {
    select: (res) => res.data,
    onSuccess: (data) => {
      window.location.href = data.data.authorization_url;
    },
    ...props,
  });
};

/**
 * Authentication OIDC login
 */

export const useAuthOidcLogin = (props) => {
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('oidc/login', values), {
    select: (res) => res.data,
    onSuccess: (data) => {
      // Set authentication cookies.
      setAuthLoginCookies(data.data);

      window.location.href = '/';
    },
    ...props,
  });
};

/**
 * Authentication OIDC logout
 */

export const useAuthOidcLogout = (props) => {
  const apiRequest = useApiRequest();
  const { setLogout } = useAuthActions();

  return useMutation((values) => apiRequest.post('oidc/logout', values), {
    select: (res) => res.data,
    onSuccess: (data) => {
      const logoutUrl = data.data.logout_url;

      setLogout(logoutUrl);
    },
    onError: (err) => {
      setLogout();
    },
    ...props,
  });
};

/**
 * Authentication register.
 */
export const useAuthRegister = (props) => {
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('auth/register', values),
    props,
  );
};

/**
 * Authentication send reset password.
 */
export const useAuthSendResetPassword = (props) => {
  const apiRequest = useApiRequest();

  return useMutation(
    (email) => apiRequest.post('auth/send_reset_password', email),
    props,
  );
};

/**
 * Authentication reset password.
 */
export const useAuthResetPassword = (props) => {
  const apiRequest = useApiRequest();

  return useMutation(
    ([token, values]) => apiRequest.post(`auth/reset/${token}`, values),
    props,
  );
};

/**
 * Fetches the authentication page metadata.
 */
export const useAuthMetadata = (props) => {
  return useRequestQuery(
    [t.AUTH_METADATA_PAGE],
    {
      method: 'get',
      url: `auth/meta`,
    },
    {
      select: (res) => res.data,
      defaultData: {},
      ...props,
    },
  );
};

/**
 *
 */
export const useAuthSignUpVerifyResendMail = (props) => {
  const apiRequest = useApiRequest();

  return useMutation(
    () => apiRequest.post('auth/register/verify/resend'),
    props,
  );
};

interface AuthSignUpVerifyValues {
  token: string;
  email: string;
}

/**
 *
 */
export const useAuthSignUpVerify = (props) => {
  const apiRequest = useApiRequest();

  return useMutation(
    (values: AuthSignUpVerifyValues) =>
      apiRequest.post('auth/register/verify', values),
    props,
  );
};
