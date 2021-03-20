import { useMutation } from 'react-query';
import useApiRequest from '../useRequest';
import { useAuthActions } from '../state';

/**
 * Authentication login.
 */
export const useAuthLogin = (props) => {
  const { setLogin } = useAuthActions();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('auth/login', values),
    {
      select: (res) => res.data,
      onSuccess: (data) => {
        setLogin(data.data);
      },
      ...props
    }
  );
};

/**
 * Authentication register.
 */
export const useAuthRegister = (props) => {
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('auth/register', values),
    props,
  )
};

/**
 * Authentication send reset password.
 */
export const useAuthSendResetPassword = (props) => {
  const apiRequest = useApiRequest();

  return useMutation(
    (email) => apiRequest.post('auth/send_reset_password', email),
    props
  );
}

/**
 * Authentication reset password.
 */
export const useAuthResetPassword = (props) => {
  const apiRequest = useApiRequest();

  return useMutation(
    ([token, values]) => apiRequest.post(`auth/reset/${token}`, values),
    props,
  )
}
