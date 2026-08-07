import {
  fetchBillPayments,
  fetchBillPayment,
  createBillPayment,
  editBillPayment,
  deleteBillPayment,
  fetchBillPaymentEditPage,
  fetchBillPaymentNewPageEntries,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { paymentMadesKeys } from './query-keys';
import type {
  BillPaymentsListResponse,
  BillPayment,
  CreateBillPaymentBody,
  EditBillPaymentBody,
  BillPaymentEditPageResponse,
  BillPaymentNewPageEntriesResponse,
} from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (client: ReturnType<typeof useQueryClient>) => {
  client.invalidateQueries({ queryKey: paymentMadesKeys.all() });
  client.invalidateQueries({ queryKey: paymentMadesKeys.newEntries() });
  client.invalidateQueries({
    queryKey: paymentMadesKeys.editPage(null).slice(0, 1),
  });
};

export function usePaymentMades(
  query?: Record<string, unknown>,
  props?: Omit<
    UseQueryOptions<BillPaymentsListResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: paymentMadesKeys.list(query),
    queryFn: () => fetchBillPayments(fetcher),
  });
}

export function useCreatePaymentMade(
  props?: UseMutationOptions<void, Error, CreateBillPaymentBody>,
) {
  const client = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreateBillPaymentBody) =>
      createBillPayment(fetcher, values),
    onSuccess: () => commonInvalidateQueries(client),
  });
}

export function useEditPaymentMade(
  props?: UseMutationOptions<void, Error, [number, EditBillPaymentBody]>,
) {
  const client = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditBillPaymentBody]) =>
      editBillPayment(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      commonInvalidateQueries(client);
      client.invalidateQueries({ queryKey: paymentMadesKeys.detail(id) });
    },
  });
}

export function useDeletePaymentMade(
  props?: UseMutationOptions<void, Error, number>,
) {
  const client = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteBillPayment(fetcher, id),
    onSuccess: (_data, id) => {
      commonInvalidateQueries(client);
      client.invalidateQueries({ queryKey: paymentMadesKeys.detail(id) });
    },
  });
}

export function usePaymentMadeEditPage(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<BillPaymentEditPageResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: paymentMadesKeys.editPage(id),
    queryFn: () => fetchBillPaymentEditPage(fetcher, id!),
    enabled: id != null,
  });
}

/** New page entries – uses vendorId param via SDK. */
export function usePaymentMadeNewPageEntries(
  vendorId: number | null | undefined,
  props?: Omit<
    UseQueryOptions<BillPaymentNewPageEntriesResponse, Error>,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: paymentMadesKeys.newEntries(vendorId),
    queryFn: () => fetchBillPaymentNewPageEntries(fetcher, vendorId!),
    enabled: vendorId != null,
    select: (data) => data ?? [],
  });
}

export function useRefreshPaymentMades() {
  const queryClient = useQueryClient();
  return {
    refresh: () =>
      queryClient.invalidateQueries({ queryKey: paymentMadesKeys.all() }),
  };
}

export function usePaymentMade(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<BillPayment>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: paymentMadesKeys.detail(id),
    queryFn: () => fetchBillPayment(fetcher, id!),
    enabled: id != null,
  });
}
