import {
  fetchContact,
  fetchContactsAutoComplete,
  activateContact,
  inactivateContact,
  ContactResponse,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { castArray } from 'lodash';
import { useAuthOrganizationId } from '../../state';
import { useApiFetcher } from '../../useRequest';
import { contactsKeys } from './query-keys';

// Common invalidate queries.
const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: contactsKeys.all() });
};

export function useContact(
  id: number | string | undefined | null,
  props?: Omit<UseQueryOptions<ContactResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher();
  const organizationId = useAuthOrganizationId();
  const contactId = id != null ? Number(id) : 0;

  return useQuery({
    ...props,
    queryKey: [...contactsKeys.detail(contactId), organizationId],
    queryFn: () => fetchContact(fetcher, contactId),
    enabled: contactId > 0,
  });
}

export function useAutoCompleteContacts(
  props?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof fetchContactsAutoComplete>>>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher();
  const organizationId = useAuthOrganizationId();
  return useQuery({
    ...props,
    queryKey: [...contactsKeys.autoComplete(), organizationId],
    queryFn: () => fetchContactsAutoComplete(fetcher),
  });
}

export function useActivateContact(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => activateContact(fetcher, id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: contactsKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useInactivateContact(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => inactivateContact(fetcher, id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: contactsKeys.detail(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}
