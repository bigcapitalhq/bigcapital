// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import t from './types';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  queryClient.invalidateQueries(t.CUSTOM_FIELDS);
  queryClient.invalidateQueries(t.CUSTOM_FIELD);
};

/**
 * Retrieve the custom fields.
 */
export function useCustomFields(props, query) {
  return useRequestQuery(
    [t.CUSTOM_FIELDS, query],
    { method: 'get', url: 'custom-fields', params: query },
    {
      select: (res) => res.data?.data || [],
      defaultData: [],
      ...props,
    },
  );
}

/**
 * Retrieve the custom field.
 */
export function useCustomField(fieldId, props, requestProps) {
  return useRequestQuery(
    [t.CUSTOM_FIELD, fieldId],
    { method: 'get', url: `custom-fields/${fieldId}`, ...requestProps },
    {
      select: (res) => res.data,
      defaultData: {},
      ...props,
    },
  );
}

/**
 * Create a new custom field.
 */
export function useCreateCustomField(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('custom-fields', values), {
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edit the given custom field.
 */
export function useEditCustomField(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(([id, values]) => apiRequest.put(`custom-fields/${id}`, values), {
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Delete the given custom field.
 */
export function useDeleteCustomField(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`custom-fields/${id}`), {
    onSuccess: (res, id) => {
      queryClient.invalidateQueries(t.CUSTOM_FIELD, id);
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Reorder custom fields.
 */
export function useReorderCustomFields(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('custom-fields/reorder', values), {
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Update custom field status.
 */
export function useUpdateCustomFieldStatus(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(([id, values]) => apiRequest.put(`custom-fields/${id}/status`, values), {
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}
