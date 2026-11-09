import {
  fetchTransactionsByCustomersTable,
  fetchTransactionsByCustomersXlsx,
  fetchTransactionsByCustomersCsv,
  fetchTransactionsByCustomersPdf,
} from '@bigcapital/sdk-ts';
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { downloadFile } from '../../useDownloadFile';
import { useApiFetcher } from '../../useRequest';
import { useFetcherPdf } from '../../useRequestPdf';
import { financialReportsKeys } from './query-keys';
import type {
  TransactionsByCustomersTableQuery,
  TransactionsByCustomersTableResponse,
  TransactionsByCustomersXlsxQuery,
  TransactionsByCustomersCsvQuery,
  TransactionsByCustomersPdfQuery,
} from '@bigcapital/sdk-ts';

interface CustomersTransactionsReport {
  data: TransactionsByCustomersTableResponse['table'];
  tableRows: TransactionsByCustomersTableResponse['table']['rows'];
  meta: TransactionsByCustomersTableResponse['meta'];
}

export function useCustomersTransactionsReport(
  query: TransactionsByCustomersTableQuery,
  props?: Omit<
    UseQueryOptions<CustomersTransactionsReport, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.customerTransactions(query),
    queryFn: () =>
      fetchTransactionsByCustomersTable(fetcher, query).then((data) => ({
        data: data.table,
        tableRows: data.table.rows,
        meta: data.meta,
      })),
  });
}

export function useCustomersTransactionsXlsxExport(
  query: TransactionsByCustomersXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchTransactionsByCustomersXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'customers_transactions.xlsx'),
      ),
  });
}

export function useCustomersTransactionsCsvExport(
  query: TransactionsByCustomersCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchTransactionsByCustomersCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'customers_transactions.csv'),
      ),
  });
}

export function useCustomersTransactionsPdfExport(
  query: TransactionsByCustomersPdfQuery,
) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchTransactionsByCustomersPdf(fetcher, query));
}
