import {
  fetchImportPreview,
  fetchImportFileMeta,
  importMapping,
  importProcess,
  uploadImportFile,
  downloadImportSample,
} from '@bigcapital/sdk-ts';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { downloadFile } from '../../useDownloadFile';
import { useApiFetcher } from '../../useRequest';
import { bankingKeys } from '../banking/query-keys';
import { billsKeys } from '../bills/query-keys';
import { cashflowAccountsKeys } from '../cashflow-accounts/query-keys';
import { creditNotesKeys } from '../credit-note/query-keys';
import { customersKeys } from '../customers/query-keys';
import { estimatesKeys } from '../estimates/query-keys';
import { expensesKeys } from '../expenses/query-keys';
import { invoicesKeys } from '../invoices/query-keys';
import { itemsKeys } from '../items/query-keys';
import { manualJournalsKeys } from '../manual-journals/query-keys';
import { paymentReceivesKeys } from '../payment-receives/query-keys';
import { receiptsKeys } from '../receipts/query-keys';
import { vendorCreditsKeys } from '../vendor-credit/query-keys';
import { vendorsKeys } from '../vendors/query-keys';
import { importKeys } from './query-keys';
import type {
  ImportMappingBody,
  ImportPreviewResponse,
  ImportFileMetaResponse,
  ImportProcessResponse,
  ImportFileUploadResponse,
} from '@bigcapital/sdk-ts';

/**
 * Input accepted by the import file upload mutation. Callers may pass either a
 * ready FormData (with file/resource/params parts) or a plain object that we
 * serialize into FormData on their behalf.
 */
export type ImportFileUploadInput =
  | FormData
  | {
      file: File;
      resource: string;
      params?: Record<string, unknown>;
    };

function toImportFormData(values: ImportFileUploadInput): FormData {
  if (values instanceof FormData) {
    return values;
  }
  const formData = new FormData();
  formData.append('file', values.file);
  formData.append('resource', values.resource);
  if (values.params) {
    formData.append('params', JSON.stringify(values.params));
  }
  return formData;
}

/**
 * Upload an import file (multipart/form-data) and return the parsed response
 * (import id, sheet columns, resource columns).
 */
export function useImportFileUpload(
  props?: UseMutationOptions<
    ImportFileUploadResponse,
    Error,
    ImportFileUploadInput
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useMutation({
    ...props,
    mutationFn: (values: ImportFileUploadInput) =>
      uploadImportFile(fetcher, toImportFormData(values)),
  });
}

export function useImportFileMapping(
  props?: UseMutationOptions<void, Error, [string, ImportMappingBody]>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: ([importId, values]: [string, ImportMappingBody]) =>
      importMapping(fetcher, importId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [importKeys.preview('').slice(0, 1)],
      });
      queryClient.invalidateQueries({
        queryKey: [importKeys.fileMeta('').slice(0, 1)],
      });
    },
  });
}

export function useImportFilePreview(
  importId: string,
  props?: Omit<
    UseQueryOptions<ImportPreviewResponse, Error, unknown>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: importKeys.preview(importId),
    queryFn: () => fetchImportPreview(fetcher, importId),
    enabled: !!importId,
  });
}

export function useImportFileMeta(
  importId: string,
  props?: Omit<
    UseQueryOptions<ImportFileMetaResponse, Error, unknown>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: importKeys.fileMeta(importId),
    queryFn: () => fetchImportFileMeta(fetcher, importId),
  });
}

export function useImportFileProcess(
  props?: UseMutationOptions<ImportProcessResponse, Error, string>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: (importId: string) => importProcess(fetcher, importId),
    onSuccess: (_data, _importId) => {
      if (_data?.resource) {
        invalidateResourcesOnImport(queryClient, _data.resource);
      }
    },
  });
}

export interface SampleSheetImportQuery {
  resource: string;
  filename: string;
  format: 'xlsx' | 'csv';
}

/**
 * Download import sample sheet (csv/xlsx) as a Blob and trigger a browser save.
 */
export const useSampleSheetImport = () => {
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: (data: SampleSheetImportQuery) =>
      downloadImportSample(fetcher, {
        resource: data.resource,
        format: data.format,
      }).then((blob) => {
        downloadFile(blob, `${data.filename}.${data.format}`);
      }),
  });
};

/**
 * Invalidates resources cached queries based on the given resource name.
 */
const invalidateResourcesOnImport = (
  queryClient: QueryClient,
  resource: string,
) => {
  switch (resource) {
    case 'Item':
      queryClient.invalidateQueries({ queryKey: itemsKeys.all() });
      queryClient.invalidateQueries({
        queryKey: itemsKeys.detail(null).slice(0, 1),
      });
      break;

    case 'ItemCategory':
      queryClient.invalidateQueries({ queryKey: itemsKeys.categories() });
      break;

    case 'Bill':
      queryClient.invalidateQueries({ queryKey: billsKeys.all() });
      queryClient.invalidateQueries({
        queryKey: billsKeys.detail(null).slice(0, 1),
      });
      queryClient.invalidateQueries({
        queryKey: itemsKeys.associatedBills(null).slice(0, 1),
      });
      break;

    case 'SaleInvoice':
      queryClient.invalidateQueries({
        queryKey: invoicesKeys.detail(null).slice(0, 1),
      });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.all() });
      queryClient.invalidateQueries({
        queryKey: itemsKeys.associatedInvoices(null).slice(0, 1),
      });
      break;

    case 'SaleEstimate':
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.detail(null).slice(0, 1),
      });
      queryClient.invalidateQueries({ queryKey: estimatesKeys.all() });
      queryClient.invalidateQueries({
        queryKey: itemsKeys.associatedEstimates(null).slice(0, 1),
      });
      break;

    case 'SaleReceipt':
      queryClient.invalidateQueries({
        queryKey: receiptsKeys.detail(null).slice(0, 1),
      });
      queryClient.invalidateQueries({ queryKey: receiptsKeys.all() });
      queryClient.invalidateQueries({
        queryKey: itemsKeys.associatedReceipts(null).slice(0, 1),
      });
      break;

    case 'CreditNote':
      queryClient.invalidateQueries({
        queryKey: creditNotesKeys.detail(null).slice(0, 1),
      });
      queryClient.invalidateQueries({ queryKey: creditNotesKeys.all() });
      break;

    case 'VendorCredit':
      queryClient.invalidateQueries({
        queryKey: vendorCreditsKeys.detail(null).slice(0, 1),
      });
      queryClient.invalidateQueries({ queryKey: vendorCreditsKeys.all() });
      break;

    case 'PaymentReceive':
      queryClient.invalidateQueries({
        queryKey: paymentReceivesKeys.detail(null).slice(0, 1),
      });
      queryClient.invalidateQueries({ queryKey: paymentReceivesKeys.all() });
      break;

    case 'BillPayment':
      queryClient.invalidateQueries({
        queryKey: billsKeys.paymentTransactions(null).slice(0, 1),
      });
      break;

    case 'Customer':
      queryClient.invalidateQueries({ queryKey: customersKeys.all() });
      queryClient.invalidateQueries({
        queryKey: customersKeys.detail(null).slice(0, 1),
      });
      break;

    case 'Vendor':
      queryClient.invalidateQueries({
        queryKey: vendorsKeys.detail(null).slice(0, 1),
      });
      queryClient.invalidateQueries({ queryKey: vendorsKeys.all() });
      break;

    case 'Expense':
      queryClient.invalidateQueries({
        queryKey: expensesKeys.detail(null).slice(0, 1),
      });
      queryClient.invalidateQueries({ queryKey: expensesKeys.all() });
      break;

    case 'ManualJournal':
      queryClient.invalidateQueries({
        queryKey: manualJournalsKeys.detail(null).slice(0, 1),
      });
      queryClient.invalidateQueries({ queryKey: manualJournalsKeys.all() });
      break;

    case 'UncategorizedBankTransaction':
      queryClient.invalidateQueries({
        queryKey: cashflowAccountsKeys.transactions().slice(0, 1),
      });
      queryClient.invalidateQueries({
        queryKey: cashflowAccountsKeys.transactionsInfinity().slice(0, 1),
      });
      queryClient.invalidateQueries({
        queryKey: cashflowAccountsKeys.uncategorizedInfinity().slice(0, 1),
      });
      queryClient.invalidateQueries({
        queryKey: cashflowAccountsKeys.uncategorizedTransaction().slice(0, 1),
      });
      queryClient.invalidateQueries({
        queryKey: bankingKeys.summaryMeta().slice(0, 1),
      });
      break;
  }
};
