import {
  createCustomField,
  deleteCustomField,
  editCustomField,
  fetchCustomField,
  fetchCustomFields,
  reorderCustomFields,
  updateCustomFieldStatus,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { RESOURCE_META } from '../views/query-keys';
import { customFieldsKeys } from './query-keys';
import type {
  CreateCustomFieldBody,
  CustomField,
  CustomFieldsList,
  DeleteCustomFieldQuery,
  EditCustomFieldBody,
  GetCustomFieldsQuery,
  ReorderCustomFieldsBody,
  UpdateCustomFieldStatusBody,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: customFieldsKeys.all() });
  queryClient.invalidateQueries({ queryKey: [RESOURCE_META] });
};

export function useCustomFields(
  query?: Record<string, unknown>,
  props?: Omit<UseQueryOptions<CustomFieldsList>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: customFieldsKeys.list(query),
    queryFn: () => fetchCustomFields(fetcher, query as GetCustomFieldsQuery),
  });
}

export function useCustomField(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<CustomField>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: customFieldsKeys.detail(id),
    queryFn: () => fetchCustomField(fetcher, id!),
    enabled: id != null && (props?.enabled ?? true),
  });
}

export function useCreateCustomField(
  props?: UseMutationOptions<CustomField, Error, CreateCustomFieldBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (values: CreateCustomFieldBody) =>
      createCustomField(fetcher, values),
    onSuccess: (data, variables, context) => {
      commonInvalidateQueries(queryClient);
      (props?.onSuccess as any)?.(data, variables, undefined, context);
    },
  });
}

export function useEditCustomField(
  props?: UseMutationOptions<CustomField, Error, [number, EditCustomFieldBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditCustomFieldBody]) =>
      editCustomField(fetcher, id, values),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: customFieldsKeys.detail(variables[0]),
      });
      commonInvalidateQueries(queryClient);
      (props?.onSuccess as any)?.(data, variables, undefined, context);
    },
  });
}

export function useDeleteCustomField(
  props?: UseMutationOptions<
    void,
    Error,
    { id: number; query?: DeleteCustomFieldQuery }
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ({
      id,
      query,
    }: {
      id: number;
      query?: DeleteCustomFieldQuery;
    }) => deleteCustomField(fetcher, id, query),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: customFieldsKeys.detail(variables.id),
      });
      commonInvalidateQueries(queryClient);
      (props?.onSuccess as any)?.(data, variables, undefined, context);
    },
  });
}

export function useUpdateCustomFieldStatus(
  props?: UseMutationOptions<
    CustomField,
    Error,
    [number, UpdateCustomFieldStatusBody]
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, UpdateCustomFieldStatusBody]) =>
      updateCustomFieldStatus(fetcher, id, values),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: customFieldsKeys.detail(variables[0]),
      });
      commonInvalidateQueries(queryClient);
      (props?.onSuccess as any)?.(data, variables, undefined, context);
    },
  });
}

export function useReorderCustomFields(
  props?: UseMutationOptions<CustomField[], Error, ReorderCustomFieldsBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (values: ReorderCustomFieldsBody) =>
      reorderCustomFields(fetcher, values),
    onSuccess: (data, variables, context) => {
      commonInvalidateQueries(queryClient);
      (props?.onSuccess as any)?.(data, variables, undefined, context);
    },
  });
}
