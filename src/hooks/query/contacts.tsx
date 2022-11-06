// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import useApiRequest from '../useRequest';
import { useQueryTenant } from '../useQueryRequest';
import t from './types';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate vendors.
  queryClient.invalidateQueries(t.VENDORS);
  // Invalidate customers.
  queryClient.invalidateQueries(t.CUSTOMERS);
};

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

/**
 * Activate the given Contact.
 */
export function useActivateContact(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`contacts/${id}/activate`), {
    onSuccess: (res, id) => {
      // Invalidate specific contact.
      queryClient.invalidateQueries([t.CONTACT, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Inactivate the given contact.
 */
export function useInactivateContact(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`contacts/${id}/inactivate`), {
    onSuccess: (res, id) => {
      // Invalidate specific item.
      queryClient.invalidateQueries([t.CONTACT, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}
