import {
  fetchSaleInvoices,
  fetchSaleInvoice,
  createSaleInvoice,
  editSaleInvoice,
  deleteSaleInvoice,
  bulkDeleteSaleInvoices,
  validateBulkDeleteSaleInvoices,
  deliverSaleInvoice,
  writeOffSaleInvoice,
  cancelWrittenOffSaleInvoice,
  fetchReceivableSaleInvoices,
  fetchSaleInvoiceMailState,
  sendSaleInvoiceMail,
  fetchSaleInvoiceState,
  fetchInvoicePayments,
  fetchSaleInvoiceHtml,
} from '@bigcapital/sdk-ts';
import {
  useQueryClient,
  useMutation,
  useQuery,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useRequestQuery } from '../../useQueryRequest';
import { useApiFetcher } from '../../useRequest';
import useApiRequest from '../../useRequest';
import { useRequestPdf } from '../../useRequestPdf';
import { accountsKeys } from '../accounts/query-keys';
import { creditNotesKeys } from '../credit-note/query-keys';
import { customersKeys } from '../customers/query-keys';
import { estimatesKeys } from '../estimates/query-keys';
import { financialReportsKeys } from '../FinancialReports/query-keys';
import { itemsKeys } from '../items/query-keys';
import { organizationKeys } from '../organization/query-keys';
import { settingsKeys } from '../settings/query-keys';
import { invoicesKeys } from './query-keys';
import type {
  SaleInvoicesListResponse,
  SaleInvoice,
  CreateSaleInvoiceBody,
  EditSaleInvoiceBody,
  GetSaleInvoicesQuery,
  ValidateBulkDeleteSaleInvoicesResponse,
  SaleInvoiceStateResponse,
  InvoicePaymentTransactionsResponse,
  SaleInvoiceHtmlContentResponse,
} from '@bigcapital/sdk-ts';
import { transformToCamelCase } from '@/utils';

function commonInvalidateQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  queryClient.invalidateQueries({ queryKey: invoicesKeys.all() });
  queryClient.invalidateQueries({ queryKey: customersKeys.all() });
  queryClient.invalidateQueries({ queryKey: itemsKeys.all() });
  queryClient.invalidateQueries({ queryKey: settingsKeys.invoices() });
  queryClient.invalidateQueries({ queryKey: financialReportsKeys.all() });
  queryClient.invalidateQueries({
    queryKey: financialReportsKeys.transactionsByReference().slice(0, 1),
  });
  queryClient.invalidateQueries({ queryKey: accountsKeys.all() });
  queryClient.invalidateQueries({
    queryKey: creditNotesKeys.reconcile(null).slice(0, 1),
  });
  queryClient.invalidateQueries({
    queryKey: creditNotesKeys.reconciles(null).slice(0, 1),
  });
  queryClient.invalidateQueries({
    queryKey: organizationKeys.mutateAbilities(),
  });
}

export function useCreateInvoice(
  props?: UseMutationOptions<void, Error, CreateSaleInvoiceBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (values: CreateSaleInvoiceBody) =>
      createSaleInvoice(fetcher, values),
    onSuccess: (_data, values) => {
      const customerId = values.customerId as unknown as number;
      queryClient.invalidateQueries({
        queryKey: customersKeys.detail(customerId),
      });
      queryClient.invalidateQueries({ queryKey: estimatesKeys.all() });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useEditInvoice(
  props?: UseMutationOptions<void, Error, [number, EditSaleInvoiceBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, EditSaleInvoiceBody]) =>
      editSaleInvoice(fetcher, id, values),
    onSuccess: (_data, [id, values]) => {
      const customerId = values.customerId as unknown as number;
      queryClient.invalidateQueries({ queryKey: invoicesKeys.detail(id) });
      queryClient.invalidateQueries({
        queryKey: customersKeys.detail(customerId),
      });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useDeleteInvoice(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => deleteSaleInvoice(fetcher, id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: invoicesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: estimatesKeys.all() });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useBulkDeleteInvoices(
  props?: UseMutationOptions<
    void,
    Error,
    { ids: number[]; skipUndeletable?: boolean }
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ({
      ids,
      skipUndeletable = false,
    }: {
      ids: number[];
      skipUndeletable?: boolean;
    }) => bulkDeleteSaleInvoices(fetcher, { ids, skipUndeletable }),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

export function useValidateBulkDeleteInvoices(
  props?: UseMutationOptions<
    ValidateBulkDeleteSaleInvoicesResponse,
    Error,
    number[]
  >,
) {
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (ids: number[]) => validateBulkDeleteSaleInvoices(fetcher, ids),
  });
}

export function useInvoices(
  query?: GetSaleInvoicesQuery,
  props?: UseQueryOptions<SaleInvoicesListResponse, Error>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: invoicesKeys.list(query),
    queryFn: () => fetchSaleInvoices(fetcher, query),
  });
}

export function useDeliverInvoice(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (invoiceId: number) => deliverSaleInvoice(fetcher, invoiceId),
    onSuccess: (_data, invoiceId) => {
      queryClient.invalidateQueries({
        queryKey: invoicesKeys.detail(invoiceId),
      });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useInvoice(
  invoiceId: number | null | undefined,
  props?: Omit<UseQueryOptions<SaleInvoice>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: invoicesKeys.detail(invoiceId),
    queryFn: () => fetchSaleInvoice(fetcher, invoiceId as number),
    enabled: invoiceId != null,
  });
}

/**
 * Retrieve the invoice pdf document data.
 */
export function usePdfInvoice(invoiceId: number) {
  return useRequestPdf({
    url: `sale-invoices/${invoiceId}`,
  });
}

export function useInvoiceHtml(
  invoiceId: number,
  options?: UseQueryOptions<SaleInvoiceHtmlContentResponse, Error>,
): UseQueryResult<SaleInvoiceHtmlContentResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...options,
    queryKey: invoicesKeys.html(invoiceId),
    queryFn: () => fetchSaleInvoiceHtml(fetcher, invoiceId),
  });
}

export function useDueInvoices(
  customerId: number | null | undefined,
  props?: UseQueryOptions<unknown, Error>,
) {
  const fetcher = useApiFetcher();
  return useQuery({
    ...props,
    queryKey: invoicesKeys.due(customerId),
    queryFn: () =>
      fetchReceivableSaleInvoices(fetcher, customerId ?? undefined),
    enabled: customerId != null,
  });
}

export function useRefreshInvoices() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: invoicesKeys.all() });
    },
  };
}

export function useCreateBadDebt(
  props?: UseMutationOptions<void, Error, [number, Record<string, unknown>]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, Record<string, unknown>]) =>
      writeOffSaleInvoice(fetcher, id, values),
    onSuccess: (_data, [id]) => {
      queryClient.invalidateQueries({ queryKey: invoicesKeys.badDebt(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

export function useCancelBadDebt(
  props?: UseMutationOptions<void, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (id: number) => cancelWrittenOffSaleInvoice(fetcher, id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: invoicesKeys.cancelBadDebt(id),
      });
      commonInvalidateQueries(queryClient);
    },
  });
}

// Not in OpenAPI schema for sale-invoices; keep using apiRequest.
export function useCreateNotifyInvoiceBySMS(
  props?: UseMutationOptions<unknown, Error, [number, Record<string, unknown>]>,
) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation({
    ...props,
    mutationFn: ([id, values]: [number, Record<string, unknown>]) =>
      apiRequest.post(`sale-invoices/${id}/notify-by-sms`, values, {}),
    onSuccess: (_data, [id]) => {
      queryClient.invalidateQueries({ queryKey: invoicesKeys.notifyBySms(id) });
      commonInvalidateQueries(queryClient);
    },
  });
}

// Not in OpenAPI schema for sale-invoices; keep using useRequestQuery.
export function useInvoiceSMSDetail(
  invoiceId: number,
  query?: Record<string, unknown>,
  props?: Record<string, unknown>,
) {
  return useRequestQuery(
    [...invoicesKeys.smsDetail(invoiceId), query],
    {
      method: 'get',
      url: `sale-invoices/${invoiceId}/sms-details`,
      params: query,
    } as { method: string; url: string; params?: Record<string, unknown> },
    {
      select: (res: { data: unknown }) => res.data,
      defaultData: {},
      ...props,
    },
  );
}

export function useInvoicePaymentTransactions(
  invoiceId: number | null | undefined,
  props?: Omit<
    UseQueryOptions<InvoicePaymentTransactionsResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: invoicesKeys.paymentTransactions(invoiceId),
    queryFn: () => fetchInvoicePayments(fetcher, invoiceId!),
    enabled: invoiceId != null,
  });
}

// # Send sale invoice mail.
export interface SendSaleInvoiceMailValues {
  id: number;
  values: {
    subject: string;
    message: string;
    to: Array<string>;
    cc?: Array<string>;
    bcc?: Array<string>;
    attachInvoice?: boolean;
  };
}

export type SendSaleInvoiceMailResponse = void;

export function useSendSaleInvoiceMail(
  options?: UseMutationOptions<
    SendSaleInvoiceMailResponse,
    Error,
    SendSaleInvoiceMailValues
  >,
): UseMutationResult<
  SendSaleInvoiceMailResponse,
  Error,
  SendSaleInvoiceMailValues
> {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...options,
    mutationFn: (value: SendSaleInvoiceMailValues) =>
      sendSaleInvoiceMail(fetcher, value.id, value.values),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

// # Get sale invoice mail state.
export interface GetSaleInvoiceDefaultOptionsResponse {
  companyName: string;
  companyLogoUri: string;
  customerName: string;
  dueDate: string;
  dueDateFormatted: string;
  dueAmount: number;
  dueAmountFormatted: string;
  entries: Array<{
    quantity: number;
    quantityFormatted: string;
    rate: number;
    rateFormatted: string;
    total: number;
    totalFormatted: string;
  }>;
  formatArgs: Record<string, string>;
  from: string[];
  to: string[];
  invoiceDate: string;
  invoiceDateFormatted: string;
  invoiceNo: string;
  message: string;
  subject: string;
  subtotal: number;
  subtotalFormatted: string;
  discountAmount: number;
  discountAmountFormatted: string;
  discountLabel: string;
  discountPercentage: number;
  discountPercentageFormatted: string;
  adjustment: number;
  adjustmentFormatted: string;
  total: number;
  totalFormatted: string;
  attachInvoice: boolean;
  primaryColor: string;
}

export function useSaleInvoiceMailState(
  invoiceId: number,
  options?: UseQueryOptions<GetSaleInvoiceDefaultOptionsResponse, Error>,
): UseQueryResult<GetSaleInvoiceDefaultOptionsResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...options,
    queryKey: invoicesKeys.defaultOptions(invoiceId),
    queryFn: () =>
      fetchSaleInvoiceMailState(
        fetcher,
        invoiceId,
      ) as Promise<GetSaleInvoiceDefaultOptionsResponse>,
  });
}

// # Get sale invoice state.
export type GetSaleInvoiceStateResponse = SaleInvoiceStateResponse;

export function useGetSaleInvoiceState(
  options?: UseQueryOptions<GetSaleInvoiceStateResponse, Error>,
): UseQueryResult<GetSaleInvoiceStateResponse, Error> {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...options,
    queryKey: invoicesKeys.state(),
    queryFn: () =>
      fetchSaleInvoiceState(fetcher).then(
        (data: GetSaleInvoiceStateResponse & { data?: unknown }) =>
          (data?.data ?? data) as GetSaleInvoiceStateResponse,
      ),
  });
}

// # Get sale invoice branding template — not in OpenAPI schema; keep apiRequest.
export interface GetSaleInvoiceBrandingTemplateResponse {
  id: number;
  default: number;
  predefined: number;
  resource: string;
  resourceFormatted: string;
  templateName: string;
  updatedAt: string;
  createdAt: string;
  createdAtFormatted: string;
  attributes: {
    billedToLabel?: string;
    companyLogoKey?: string | null;
    companyLogoUri?: string;
    dateIssueLabel?: string;
    discountLabel?: string;
    dueAmountLabel?: string;
    dueDateLabel?: string;
    invoiceNumberLabel?: string;
    itemDescriptionLabel?: string;
    itemNameLabel?: string;
    itemRateLabel?: string;
    itemTotalLabel?: string;
    paymentMadeLabel?: string;
    primaryColor?: string;
    secondaryColor?: string;
    showCompanyAddress?: boolean;
    showCompanyLogo?: boolean;
    showCustomerAddress?: boolean;
    showDateIssue?: boolean;
    showDiscount?: boolean;
    showDueAmount?: boolean;
    showDueDate?: boolean;
    showInvoiceNumber?: boolean;
    showPaymentMade?: boolean;
    showStatement?: boolean;
    showSubtotal?: boolean;
    showTaxes?: boolean;
    showTermsConditions?: boolean;
    showTotal?: boolean;
    statementLabel?: string;
    subtotalLabel?: string;
    termsConditionsLabel?: string;
    totalLabel?: string;
  };
}

export function useGetSaleInvoiceBrandingTemplate(
  invoiceId: number,
  options?: UseQueryOptions<GetSaleInvoiceBrandingTemplateResponse, Error>,
): UseQueryResult<GetSaleInvoiceBrandingTemplateResponse, Error> {
  const apiRequest = useApiRequest();

  return useQuery({
    ...options,
    queryKey: invoicesKeys.brandingTemplate(invoiceId),
    queryFn: () =>
      apiRequest
        .get(`/sale-invoices/${invoiceId}/template`, {})
        .then(
          (res: { data?: { data?: unknown } }) =>
            transformToCamelCase(
              res.data?.data,
            ) as GetSaleInvoiceBrandingTemplateResponse,
        ),
  });
}
