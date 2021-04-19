import useApiRequest from '../useRequest';
import { useQueryTenant } from '../useQueryRequest';

/**
 * Retrieve the contact duplicate.
 */
export function useContact(id, props) {
  const apiRequest = useApiRequest();

  return useQueryTenant(
    ['CONTACT', id],
    () => apiRequest.get(`contacts/${id}`),
    {
      select: (res) => res.data.customer,
      ...props,
    },
  );
}

/**
 * Retrieve the auto-complete contacts.
 */
export function useAutoCompleteContacts(props) {
  const apiRequest = useApiRequest();

  return useQueryTenant(
    ['CONTACTS', 'AUTO-COMPLETE'],
    () => apiRequest.get('contacts/auto-complete'),
    {
      select: (res) => res.data.contacts,
      defaultData: [],
      ...props,
    },
  );
}
