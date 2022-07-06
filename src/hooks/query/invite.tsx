import { useMutation } from 'react-query';
import { useRequestQuery } from '@/hooks/useQueryRequest';
import useApiRequest from '@/hooks/useRequest';

/**
 * Authentication invite accept.
 */
export const useAuthInviteAccept = (props) => {
  const apiRequest = useApiRequest();

  return useMutation(
    ([values, token]) => apiRequest.post(`invite/accept/${token}`, values),
    props,
  );
};

/**
 * Retrieve the invite meta by the given token.
 * @param {string} token - Token.
 */
export const useInviteMetaByToken = (token, props) => {
  return useRequestQuery(
    ['INVITE_META', token],
    { method: 'get', url: `invite/invited/${token}` },
    {
      select: (res) => res.data,
      ...props,
    },
  );
};

export const useResendInvitation = (props) => {
  const apiRequest = useApiRequest();

  return useMutation(
    (userId) => apiRequest.post(`invite/resend/${userId}`),
    props,
  );
};
