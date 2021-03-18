import useApiRequest from '../useRequest';
import { useQueryTenant } from '../useQueryRequest';

/**
 * Retrieve the contact duplicate.
 */
export function useContact(id, props) {
  const apiRequest = useApiRequest();

  return useQueryTenant(['CONTACT', id], () => apiRequest.get(`contacts/${id}`), {
    select: (res) => res.data.customer,
    ...props,
  });
}
