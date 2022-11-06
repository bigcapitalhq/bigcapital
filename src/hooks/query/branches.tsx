// @ts-nocheck
import { useQueryClient, useMutation } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import t from './types';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate warehouses.
  queryClient.invalidateQueries(t.BRANCHES);
  queryClient.invalidateQueries(t.BRANCH);

  queryClient.invalidateQueries(t.DASHBOARD_META);

};

/**
 * Create a new branch.
 */
export function useCreateBranch(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('branches', values), {
    onSuccess: (res, values) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edits the given branch.
 */
export function useEditBranch(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`branches/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific branch.
        queryClient.invalidateQueries([t.BRANCH, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Deletes the given branch.
 */
export function useDeleteBranch(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`branches/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific branch.
      queryClient.invalidateQueries([t.BRANCH, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Retrieve Branches list.
 */
export function useBranches(query, props) {
  return useRequestQuery(
    [t.BRANCHES, query],
    { method: 'get', url: 'branches', params: query },
    {
      select: (res) => res.data.branches,
      defaultData: [],
      ...props,
    },
  );
}

/**
 * Retrieve the branch details.
 * @param {number}
 */
export function useBranch(id, props, requestProps) {
  return useRequestQuery(
    [t.BRANCH, id],
    { method: 'get', url: `branches/${id}`, ...requestProps },
    {
      select: (res) => res.data.branch,
      defaultData: {},
      ...props,
    },
  );
}

/**
 * Activate the given branches.
 */
export function useActivateBranches(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`branches/activate`), {
    onSuccess: (res, id) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Mark primary the given branch.
 */
export function useMarkBranchAsPrimary(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`branches/${id}/mark-primary`), {
    onSuccess: (res, id) => {
      // Invalidate specific inventory adjustment.
      queryClient.invalidateQueries([t.BRANCH, id]);

      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}
