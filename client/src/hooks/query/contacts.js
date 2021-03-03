import { useQuery } from 'react-query';
import useApiRequest from '../useRequest';

/**
 * Retrieve the contact duplicate.
 */
export function useContact(id, props) {
  const apiRequest = useApiRequest();

  return useQuery(['CONTACT', id], () => apiRequest.get(`contacts/${id}`), {
    select: (res) => res.data.customer,
    ...props,
  });
}
