// @ts-nocheck
import {
  useQueryClient,
  useMutation,
  useQuery,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import { transformPagination, transformToCamelCase } from '@/utils';
import useApiRequest from '../useRequest';
import { useRequestPdf } from '../useRequestPdf';
import t from './types';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate invoices.
  queryClient.invalidateQueries(t.SALE_INVOICES);
  queryClient.invalidateQueries(t.SALE_INVOICE);

  // Invalidate customers.
  queryClient.invalidateQueries(t.CUSTOMERS);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ITEMS);
  queryClient.invalidateQueries(t.ITEM);

  // Invalidate settings.
  queryClient.invalidateQueries([t.SETTING, t.SETTING_INVOICES]);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);

  // Invalidate transactions by reference.
  queryClient.invalidateQueries(t.TRANSACTIONS_BY_REFERENCE);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate reconcile.
  queryClient.invalidateQueries(t.RECONCILE_CREDIT_NOTE);
  queryClient.invalidateQueries(t.RECONCILE_CREDIT_NOTES);

  // Invalidate
  queryClient.invalidateQueries(t.ITEM_ASSOCIATED_WITH_INVOICES);

  // Invalidate item warehouses.
  queryClient.invalidateQueries(t.ITEM_WAREHOUSES_LOCATION);

  // Invalidate mutate base currency abilities.
  queryClient.invalidateQueries(t.ORGANIZATION_MUTATE_BASE_CURRENCY_ABILITIES);
};

/**
 * Creates a new sale invoice.
 */
export function useCreateInvoice(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('sales/invoices', values), {
    onSuccess: (res, values) => {
      // Invalidate invoice customer.
      queryClient.invalidateQueries([t.CUSTOMER, values.customer_id]);

      // Invalidate estimates.
      queryClient.invalidateQueries(t.SALE_ESTIMATES);
      queryClient.invalidateQueries(t.SALE_ESTIMATE);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edits the given sale invoice.
 */
export function useEditInvoice(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`sales/invoices/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific sale invoice.
        queryClient.invalidateQueries([t.SALE_INVOICE, id]);

        // Invalidate invoice customer.
        queryClient.invalidateQueries([t.CUSTOMER, values.customer_id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Deletes the given sale invoice.
 */
export function useDeleteInvoice(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`sales/invoices/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific invoice.
      queryClient.invalidateQueries([t.SALE_INVOICE, id]);

      // Invalidate estimates.
      queryClient.invalidateQueries(t.SALE_ESTIMATES);
      queryClient.invalidateQueries(t.SALE_ESTIMATE);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

const transformInvoices = (res) => ({
  invoices: res.data.sales_invoices,
  pagination: transformPagination(res.data.pagination),
  filterMeta: res.data.filter_meta,
});

/**
 * Retrieve sale invoices list with pagination meta.
 */
export function useInvoices(query, props) {
  return useRequestQuery(
    [t.SALE_INVOICES, query],
    { method: 'get', url: 'sales/invoices', params: query },
    {
      select: transformInvoices,
      defaultData: {
        invoices: [],
        pagination: {
          page: 1,
          pageSize: 20,
          total: 0,
        },
        filterMeta: {},
      },
      ...props,
    },
  );
}

/**
 * Marks the sale invoice as delivered.
 */
export function useDeliverInvoice(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (invoiceId) => apiRequest.post(`sales/invoices/${invoiceId}/deliver`),
    {
      onSuccess: (res, invoiceId) => {
        // Invalidate specific invoice.
        queryClient.invalidateQueries([t.SALE_INVOICE, invoiceId]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Retrieve the sale invoice details.
 * @param {number} invoiceId - Invoice id.
 */
export function useInvoice(invoiceId, props, requestProps) {
  return useRequestQuery(
    [t.SALE_INVOICE, invoiceId],
    { method: 'get', url: `sales/invoices/${invoiceId}`, ...requestProps },
    {
      select: (res) => res.data.sale_invoice,
      defaultData: {},
      ...props,
    },
  );
}

/**
 * Retrieve the invoice pdf document data.
 */
export function usePdfInvoice(invoiceId) {
  return useRequestPdf({
    url: `sales/invoices/${invoiceId}`,
  });
}

interface GetInvoiceHtmlResponse {
  htmlContent: string;
}
/**
 * Retrieves the invoice html content.
 * @param {number} invoiceId
 * @param {UseQueryOptions<GetInvoiceHtmlResponse>} options
 * @returns {UseQueryResult<GetInvoiceHtmlResponse>} 
 */
export const useInvoiceHtml = (
  invoiceId: number,
  options?: UseQueryOptions<GetInvoiceHtmlResponse>,
): UseQueryResult<GetInvoiceHtmlResponse> => {
  const apiRequest = useApiRequest();

  return useQuery<GetInvoiceHtmlResponse>(
    ['SALE_INVOICE_HTML', invoiceId],
    () =>
      apiRequest
        .get(`sales/invoices/${invoiceId}`, {
          headers: {
            Accept: 'application/json+html',
          },
        })
        .then((res) => transformToCamelCase(res.data)),
  );
};

/**
 * Retrieve due invoices of the given customer id.
 * @param {number} customerId - Customer id.
 */
export function useDueInvoices(customerId, props) {
  return useRequestQuery(
    [t.SALE_INVOICES, t.SALE_INVOICES_DUE, customerId],
    {
      method: 'get',
      url: `sales/invoices/payable`,
      params: { customer_id: customerId },
    },
    {
      select: (res) => res.data.sales_invoices,
      defaultData: [],
      ...props,
    },
  );
}

export function useRefreshInvoices() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.SALE_INVOICES);
    },
  };
}

export function useCreateBadDebt(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`sales/invoices/${id}/writeoff`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate
        queryClient.invalidateQueries([t.BAD_DEBT, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

export function useCancelBadDebt(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (id) => apiRequest.post(`sales/invoices/${id}/writeoff/cancel`),
    {
      onSuccess: (res, id) => {
        // Invalidate
        queryClient.invalidateQueries([t.CANCEL_BAD_DEBT, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

export function useCreateNotifyInvoiceBySMS(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) =>
      apiRequest.post(`sales/invoices/${id}/notify-by-sms`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate
        queryClient.invalidateQueries([t.NOTIFY_SALE_INVOICE_BY_SMS, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

export function useInvoiceSMSDetail(invoiceId, query, props) {
  return useRequestQuery(
    [t.SALE_INVOICE_SMS_DETAIL, invoiceId, query],
    {
      method: 'get',
      url: `sales/invoices/${invoiceId}/sms-details`,
      params: query,
    },
    {
      select: (res) => res.data.data,
      defaultData: {},
      ...props,
    },
  );
}

export function useInvoicePaymentTransactions(invoiceId, props) {
  return useRequestQuery(
    [t.SALE_INVOICE_PAYMENT_TRANSACTIONS, invoiceId],
    {
      method: 'get',
      url: `sales/invoices/${invoiceId}/payment-transactions`,
    },
    {
      select: (res) => res.data.data,
      defaultData: [],
      ...props,
    },
  );
}

// # Send sale invoice mail.
// ------------------------------
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
export interface SendSaleInvoiceMailResponse { }
/**
 * Sends the sale invoice mail.
 * @param {UseMutationOptions<SendSaleInvoiceMailValues, Error, SendSaleInvoiceMailResponse>}
 * @returns {UseMutationResult<SendSaleInvoiceMailResponse, Error, SendSaleInvoiceMailValues>}
 */
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
  const apiRequest = useApiRequest();

  return useMutation<
    SendSaleInvoiceMailResponse,
    Error,
    SendSaleInvoiceMailValues
  >(
    (value) => apiRequest.post(`sales/invoices/${value.id}/mail`, value.values),
    {
      onSuccess: (res) => {
        commonInvalidateQueries(queryClient);
      },
      ...options,
    },
  );
}

// # Get sale invoice default options.
// --------------------------------------
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
  options?: UseQueryOptions<GetSaleInvoiceDefaultOptionsResponse>,
): UseQueryResult<GetSaleInvoiceDefaultOptionsResponse> {
  const apiRequest = useApiRequest();

  return useQuery<GetSaleInvoiceDefaultOptionsResponse>(
    [t.SALE_INVOICE_DEFAULT_OPTIONS, invoiceId],
    () =>
      apiRequest
        .get(`/sales/invoices/${invoiceId}/mail/state`)
        .then((res) => transformToCamelCase(res.data?.data)),
    options,
  );
}

// # Get sale invoice state.
// -------------------------------------
export interface GetSaleInvoiceStateResponse {
  defaultTemplateId: number;
}

export function useGetSaleInvoiceState(
  options?: UseQueryOptions<GetSaleInvoiceStateResponse, Error>,
): UseQueryResult<GetSaleInvoiceStateResponse, Error> {
  const apiRequest = useApiRequest();

  return useQuery<GetSaleInvoiceStateResponse, Error>(
    ['SALE_INVOICE_STATE'],
    () =>
      apiRequest
        .get(`/sales/invoices/state`)
        .then((res) => transformToCamelCase(res.data?.data)),
    { ...options },
  );
}

// # Get sale invoice branding template.
// --------------------------------------
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

  return useQuery<GetSaleInvoiceBrandingTemplateResponse, Error>(
    ['SALE_INVOICE_BRANDING_TEMPLATE', invoiceId],
    () =>
      apiRequest
        .get(`/sales/invoices/${invoiceId}/template`)
        .then((res) => transformToCamelCase(res.data?.data)),
    { ...options },
  );
}
