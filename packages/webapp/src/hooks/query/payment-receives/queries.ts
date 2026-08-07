import {
  fetchPaymentsReceived,
  fetchPaymentReceived,
  createPaymentReceived,
  editPaymentReceived,
  deletePaymentReceived,
  bulkDeletePaymentsReceived,
  validateBulkDeletePaymentsReceived,
  fetchPaymentReceiveEditPage,
  fetchPaymentReceiveMail,
  sendPaymentReceiveMail,
  fetchPaymentReceivedState,
  fetchPaymentReceiveHtmlContent,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQueryClient,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { useRequestQuery } from '../../useQueryRequest';
import useApiRequest, { useApiFetcher } from '../../useRequest';
import { useRequestPdf } from '../../useRequestPdf';
import { accountsKeys } from '../accounts/query-keys';
import { cashflowAccountsKeys } from '../cashflow-accounts/query-keys';
import { creditNotesKeys } from '../credit-note/query-keys';
import { customersKeys } from '../customers/query-keys';
import { financialReportsKeys } from '../FinancialReports/query-keys';
import { invoicesKeys } from '../invoices/query-keys';
import { settingsKeys } from '../settings/query-keys';
import { paymentReceivesKeys } from './query-keys';
import type {
  PaymentsReceivedListResponse,
  PaymentReceived,
  CreatePaymentReceivedBody,
  EditPaymentReceivedBody,
  BulkDeletePaymentsReceivedBody,
  ValidateBulkDeletePaymentsReceivedResponse,
  PaymentReceivedStateResponse,
  PaymentReceivedHtmlContentResponse,
  PaymentReceiveEditPageResponse,
  PaymentReceiveMailStateResponse,
  SendPaymentReceiveMailBody,
  SendPaymentReceiveMailResponse,
} from '@bigcapital/sdk-ts';
import { saveInvoke } from '@/utils';

const commonInvalidateQueries = (client: ReturnType<typeof useQueryClient>) => {
  client.invalidateQueries({ queryKey: paymentReceivesKeys.all() });
  client.invalidateQueries({
    queryKey: paymentReceivesKeys.editPage(null).slice(0, 1),
  });
  client.invalidateQueries({ queryKey: invoicesKeys.all() });
  client.invalidateQueries({ queryKey: accountsKeys.all() });
  client.invalidateQueries({ queryKey: financialReportsKeys.all() });
  client.invalidateQueries({
    queryKey: financialReportsKeys.transactionsByReference().slice(0, 1),
  });
  client.invalidateQueries({ queryKey: customersKeys.all() });
  client.invalidateQueries({
    queryKey: cashflowAccountsKeys.transactions().slice(0, 1),
  });
  client.invalidateQueries({
    queryKey: cashflowAccountsKeys.transactionsInfinity().slice(0, 1),
  });
  client.invalidateQueries({ queryKey: creditNotesKeys.all() });
  client.invalidateQueries({
    queryKey: creditNotesKeys.reconcile(null).slice(0, 1),
  });
  client.invalidateQueries({
    queryKey: invoicesKeys.paymentTransactions(null).slice(0, 1),
  });
};

export function usePaymentReceives(
  query?: Record<string, unknown>,
  props?: Omit<
    UseQueryOptions<PaymentsReceivedListResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: paymentReceivesKeys.list(query),
    queryFn: () => fetchPaymentsReceived(fetcher),
  });
}

export function useCreatePaymentReceive(
  props?: UseMutationOptions<void, Error, CreatePaymentReceivedBody>,
) {
  const client = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (values: CreatePaymentReceivedBody) =>
      createPaymentReceived(fetcher, values),
    onSuccess: (data, _values) => {
      commonInvalidateQueries(client);
      client.invalidateQueries({ queryKey: settingsKeys.paymentReceives() });
      saveInvoke(props?.onSuccess, data);
    },
  });
}

export function useEditPaymentReceive(
  props?: UseMutationOptions<void, Error, [number, EditPaymentReceivedBody]>,
) {
  const client = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditPaymentReceivedBody]) =>
      editPaymentReceived(fetcher, id, values),
    onSuccess: (data, [id]) => {
      client.invalidateQueries({ queryKey: paymentReceivesKeys.detail(id) });
      commonInvalidateQueries(client);
      saveInvoke(props?.onSuccess, data);
    },
  });
}

export function useDeletePaymentReceive(
  props?: UseMutationOptions<void, Error, number>,
) {
  const client = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deletePaymentReceived(fetcher, id),
    onSuccess: (data, id) => {
      client.invalidateQueries({ queryKey: paymentReceivesKeys.detail(id) });
      commonInvalidateQueries(client);
      saveInvoke(props?.onSuccess, data);
    },
  });
}

export function useBulkDeletePaymentReceives(
  props?: UseMutationOptions<void, Error, BulkDeletePaymentsReceivedBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (body: BulkDeletePaymentsReceivedBody) =>
      bulkDeletePaymentsReceived(fetcher, body),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useValidateBulkDeletePaymentReceives(
  props?: UseMutationOptions<
    ValidateBulkDeletePaymentsReceivedResponse,
    Error,
    number[]
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (ids: number[]) =>
      validateBulkDeletePaymentsReceived(fetcher, ids),
  });
}

export function usePaymentReceive(
  id: number | null | undefined,
  props?: Omit<UseQueryOptions<PaymentReceived>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: paymentReceivesKeys.detail(id),
    queryFn: () => fetchPaymentReceived(fetcher, id!),
    enabled: id != null,
  });
}

export function usePaymentReceiveEditPage(
  id: number | null | undefined,
  props?: Omit<
    UseQueryOptions<PaymentReceiveEditPageResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: paymentReceivesKeys.editPage(id),
    queryFn: () => fetchPaymentReceiveEditPage(fetcher, id!),
    enabled: id != null,
  });
}

export function useRefreshPaymentReceive() {
  const queryClient = useQueryClient();
  return {
    refresh: () =>
      queryClient.invalidateQueries({ queryKey: paymentReceivesKeys.all() }),
  };
}

/** Notify by SMS – no SDK route in schema; kept on apiRequest. */
export function useCreateNotifyPaymentReceiveBySMS(
  props?: UseMutationOptions<unknown, Error, [number, Record<string, unknown>]>,
) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, Record<string, unknown>]) =>
      apiRequest.post(`payments-received/${id}/notify-by-sms`, values, {}),
    onSuccess: (_res, [id]) => {
      queryClient.invalidateQueries({
        queryKey: paymentReceivesKeys.notifyBySms(id),
      });
      commonInvalidateQueries(queryClient);
    },
  });
}

/** SMS detail – no SDK route in schema; kept on useRequestQuery. */
export function usePaymentReceiveSMSDetail(
  paymentReceiveId: number | null | undefined,
  props?: Record<string, unknown>,
  requestProps?: Record<string, unknown>,
) {
  return useRequestQuery(
    paymentReceivesKeys.smsDetail(paymentReceiveId),
    {
      method: 'get',
      url: `payments-received/${paymentReceiveId}/sms-details`,
      ...requestProps,
    },
    {
      select: (res: { data: unknown }) => res.data,
      defaultData: {},
      ...props,
    },
  );
}

export function usePdfPaymentReceive(paymentReceiveId: number) {
  return useRequestPdf({ url: `payments-received/${paymentReceiveId}` });
}

export function useSendPaymentReceiveMail(
  props?: UseMutationOptions<
    SendPaymentReceiveMailResponse,
    Error,
    [number, SendPaymentReceiveMailBody]
  >,
): UseMutationResult<
  SendPaymentReceiveMailResponse,
  Error,
  [number, SendPaymentReceiveMailBody],
  unknown
> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, SendPaymentReceiveMailBody]) =>
      sendPaymentReceiveMail(fetcher, id, values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function usePaymentReceivedMailState(
  paymentReceiveId: number,
  props?: UseQueryOptions<PaymentReceiveMailStateResponse, Error>,
): UseQueryResult<PaymentReceiveMailStateResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: paymentReceivesKeys.mailOptions(paymentReceiveId),
    queryFn: () => fetchPaymentReceiveMail(fetcher, paymentReceiveId),
  });
}

export function usePaymentReceivedState(
  options?: UseQueryOptions<PaymentReceivedStateResponse, Error>,
): UseQueryResult<PaymentReceivedStateResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...options,
    queryKey: paymentReceivesKeys.state(),
    queryFn: () => fetchPaymentReceivedState(fetcher),
  });
}

/**
 * Retrieves the payment received HTML content.
 */
export function useGetPaymentReceiveHtml(
  paymentReceivedId: number,
  options?: UseQueryOptions<PaymentReceivedHtmlContentResponse, Error>,
): UseQueryResult<PaymentReceivedHtmlContentResponse, Error> {
  const fetcher = useApiFetcher();

  return useQuery({
    ...options,
    queryKey: paymentReceivesKeys.html(paymentReceivedId),
    queryFn: () => fetchPaymentReceiveHtmlContent(fetcher, paymentReceivedId),
  });
}
