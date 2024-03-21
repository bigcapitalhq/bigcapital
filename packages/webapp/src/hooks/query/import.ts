// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useApiRequest from '../useRequest';
import { transformToCamelCase } from '@/utils';

/**
 *
 */
export function useImportFileUpload(props = {}) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post(`import/file`, values), {
    onSuccess: (res, id) => {
      // Invalidate queries.
    },
    ...props,
  });
}

export function useImportFileMapping(props = {}) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([importId, values]) =>
      apiRequest.post(`import/${importId}/mapping`, values),
    {
      onSuccess: (res, id) => {
        // Invalidate queries.
      },
      ...props,
    },
  );
}
export function useImportFilePreview(importId: string, props = {}) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useQuery(['importPreview', importId], () =>
    apiRequest
      .get(`import/${importId}/preview`)
      .then((res) => transformToCamelCase(res.data)),
  );
}

/**
 *
 */
export function useImportFileProcess(props = {}) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (importId) => apiRequest.post(`import/${importId}/import`),
    {
      onSuccess: (res, id) => {
        // Invalidate queries.
      },
      ...props,
    },
  );
}
