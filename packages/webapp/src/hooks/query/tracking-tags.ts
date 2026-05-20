// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import QUERY_TYPES from './types';
import useApiRequest from '../useRequest';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  queryClient.invalidateQueries(QUERY_TYPES.TRACKING_TAGS);
};

/**
 * Retrieves tracking tags.
 */
export function useTrackingTags(props) {
  return useRequestQuery(
    [QUERY_TYPES.TRACKING_TAGS],
    {
      method: 'get',
      url: `tracking-tags`,
    },
    {
      select: (res) => res.data,
      defaultData: [],
      ...props,
    },
  );
}

/**
 * Retrieves tracking tag.
 * @param {number} tagId - Tracking tag id.
 */
export function useTrackingTag(tagId: string, props) {
  return useRequestQuery(
    [QUERY_TYPES.TRACKING_TAGS, tagId],
    {
      method: 'get',
      url: `tracking-tags/${tagId}`,
    },
    {
      select: (res) => res.data,
      ...props,
    },
  );
}

/**
 * Creates a new tracking tag.
 */
export function useCreateTrackingTag(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('tracking-tags', values), {
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edit the given tracking tag.
 */
export function useEditTrackingTag(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.put(`tracking-tags/${id}`, values),
    {
      onSuccess: (res, id) => {
        commonInvalidateQueries(queryClient);
        queryClient.invalidateQueries([QUERY_TYPES.TRACKING_TAGS, id]);
      },
      ...props,
    },
  );
}

/**
 * Delete the given tracking tag.
 */
export function useDeleteTrackingTag(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`tracking-tags/${id}`), {
    onSuccess: () => {
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}
