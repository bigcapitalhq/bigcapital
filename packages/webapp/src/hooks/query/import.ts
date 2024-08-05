// @ts-nocheck
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import useApiRequest from '../useRequest';
import { transformToCamelCase } from '@/utils';
import { downloadFile, useDownloadFile } from '../useDownloadFile';
import T from './types';
import { BANK_QUERY_KEY } from '@/constants/query-keys/banking';

const QueryKeys = {
  ImportPreview: 'ImportPreview',
  ImportFileMeta: 'ImportFileMeta',
};
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
        queryClient.invalidateQueries([QueryKeys.ImportPreview]);
        queryClient.invalidateQueries([QueryKeys.ImportFileMeta]);
      },
      ...props,
    },
  );
}

export function useImportFilePreview(importId: string, props = {}) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useQuery([QueryKeys.ImportPreview, importId], () =>
    apiRequest
      .get(`import/${importId}/preview`)
      .then((res) => transformToCamelCase(res.data)),
  );
}

export function useImportFileMeta(importId: string, props = {}) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useQuery([QueryKeys.ImportFileMeta, importId], () =>
    apiRequest
      .get(`import/${importId}`)
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
        invalidateResourcesOnImport(queryClient, res.data.resource);
      },
      ...props,
    },
  );
}

interface SampleSheetImportQuery {
  resource: string;
  filename: string;
  format: 'xlsx' | 'csv';
}

/**
 * Initiates a download of the balance sheet in XLSX format.
 * @param {Object} query - The query parameters for the request.
 * @param {Object} args - Additional configurations for the download.
 * @returns {Function} A function to trigger the file download.
 */
export const useSampleSheetImport = () => {
  const apiRequest = useApiRequest();

  return useMutation<void, AxiosError, IArgs>(
    (data: SampleSheetImportQuery) => {
      return apiRequest
        .get('/import/sample', {
          responseType: 'blob',
          headers: {
            accept:
              data.format === 'xlsx' ? 'application/xlsx' : 'application/csv',
          },
          params: {
            resource: data.resource,
            format: data.format,
          },
        })
        .then((res) => {
          downloadFile(res.data, `${data.filename}.${data.format}`);
          return res;
        });
    },
  );
};

/**
 * Invalidates resources cached queries based on the given resource name,
 * @param queryClient
 * @param resource
 */
const invalidateResourcesOnImport = (
  queryClient: QueryClient,
  resource: string,
) => {
  switch (resource) {
    case 'Item':
      queryClient.invalidateQueries(T.ITEMS);
      queryClient.invalidateQueries(T.ITEM);
      break;

    case 'ItemCategory':
      queryClient.invalidateQueries(T.ITEMS_CATEGORIES);
      break;

    case 'Bill':
      queryClient.invalidateQueries(T.BILLS);
      queryClient.invalidateQueries(T.BILL);
      queryClient.invalidateQueries(T.ITEMS_ASSOCIATED_WITH_BILLS);
      break;

    case 'SaleInvoice':
      queryClient.invalidateQueries(T.SALE_INVOICE);
      queryClient.invalidateQueries(T.SALE_INVOICES);
      queryClient.invalidateQueries(T.ITEM_ASSOCIATED_WITH_INVOICES);
      break;

    case 'SaleEstimate':
      queryClient.invalidateQueries(T.SALE_ESTIMATE);
      queryClient.invalidateQueries(T.SALE_ESTIMATES);
      queryClient.invalidateQueries(T.ITEM_ASSOCIATED_WITH_ESTIMATES);
      break;

    case 'SaleReceipt':
      queryClient.invalidateQueries(T.SALE_RECEIPT);
      queryClient.invalidateQueries(T.SALE_RECEIPTS);
      queryClient.invalidateQueries(T.ITEM_ASSOCIATED_WITH_RECEIPTS);
      break;

    case 'CreditNote':
      queryClient.invalidateQueries(T.CREDIT_NOTE);
      queryClient.invalidateQueries(T.CREDIT_NOTES);
      break;

    case 'VendorCredit':
      queryClient.invalidateQueries(T.VENDOR_CREDIT);
      queryClient.invalidateQueries(T.VENDOR_CREDITS);
      break;

    case 'PaymentReceive':
      queryClient.invalidateQueries(T.PAYMENT_RECEIVE);
      queryClient.invalidateQueries(T.PAYMENT_RECEIVES);
      break;

    case 'BillPayment':
      queryClient.invalidateQueries(T.BILLS_PAYMENT_TRANSACTIONS);
      break;

    case 'Customer':
      queryClient.invalidateQueries(T.CUSTOMERS);
      queryClient.invalidateQueries(T.CUSTOMER);
      break;

    case 'Vendor':
      queryClient.invalidateQueries(T.VENDOR);
      queryClient.invalidateQueries(T.VENDORS);
      break;

    case 'Expense':
      queryClient.invalidateQueries(T.EXPENSE);
      queryClient.invalidateQueries(T.EXPENSES);
      break;

    case 'ManualJournal':
      queryClient.invalidateQueries(T.MANUAL_JOURNAL);
      queryClient.invalidateQueries(T.MANUAL_JOURNALS);
      break;

    case 'UncategorizedCashflowTransaction':
      queryClient.invalidateQueries(T.CASH_FLOW_TRANSACTIONS);
      queryClient.invalidateQueries(T.CASH_FLOW_TRANSACTIONS);
      queryClient.invalidateQueries(T.CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY);
      queryClient.invalidateQueries(
        T.CASHFLOW_ACCOUNT_UNCATEGORIZED_TRANSACTIONS_INFINITY,
      );
      queryClient.invalidateQueries(T.CASHFLOW_UNCAATEGORIZED_TRANSACTION);
      queryClient.invalidateQueries(BANK_QUERY_KEY.BANK_ACCOUNT_SUMMARY_META);
      break;
  }
};
