// @ts-nocheck
import { useMutation } from 'react-query';
import useApiRequest from '../useRequest';
import { setCookie, getCookie } from '../../utils';
import { useRequestQuery } from '../useQueryRequest';
import t from './types';
import { initial } from 'lodash';

/**
 * Saves the response data to cookies.
 */
function setAuthLoginCookies(data) {
  setCookie('token', data.token);
  setCookie('authenticated_user_id', data.user.id);
  setCookie('organization_id', data.tenant[0].data.organization_id);
  setCookie('current_tenant_id', data.tenantId);
  setCookie('tenants', JSON.stringify(data.tenant));
  setCookie('tenant_id', data.tenant[0].data.id);
  if (data?.tenant[0]?.data?.metadata?.language)
    setCookie('locale', data.tenant[0].data.metadata.language);

  // const initialState = {
  //   token: getCookie('token'),
  //   organizationId: getCookie('organization_id'),
  //   tenantId: getCookie('tenant_id'),
  //   userId: getCookie('authenticated_user_id'),
  //   locale: getCookie('locale'),
  //   errors: [],
  // };
  // console.log(initialState);
  // console.log(data);
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
    [t.AUTH_METADATA_PAGE,],
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
}
