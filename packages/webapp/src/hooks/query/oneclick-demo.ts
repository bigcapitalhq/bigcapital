// @ts-nocheck
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import useApiRequest from '../useRequest';

interface CreateOneClickDemoValues {}
interface CreateOneClickDemoRes {}

/**
 *
 * @param {UseMutationOptions<CreateOneClickDemoRes, Error, CreateOneClickDemoValues>} props
 * @returns {UseMutationResult<CreateOneClickDemoRes, Error, CreateOneClickDemoValues>}
 */
export function useCreateOneClickDemo(
  props?: UseMutationOptions<
    CreateOneClickDemoRes,
    Error,
    CreateOneClickDemoValues
  >,
): UseMutationResult<CreateOneClickDemoRes, Error, CreateOneClickDemoValues> {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation<CreateOneClickDemoRes, Error, CreateOneClickDemoValues>(
    () => apiRequest.post(`/demo/one_click`),
    {
      onSuccess: (res, id) => {},
      ...props,
    },
  );
}
