import {
  fetchCustomerBalanceTable,
  fetchCustomerBalanceXlsx,
  fetchCustomerBalanceCsv,
  fetchCustomerBalancePdf,
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
  CustomerBalanceTableQuery,
  CustomerBalanceTableResponse,
  CustomerBalanceXlsxQuery,
  CustomerBalanceCsvQuery,
  CustomerBalancePdfQuery,
} from '@bigcapital/sdk-ts';

export function useCustomerBalanceSummaryReport(
  query: CustomerBalanceTableQuery,
  props?: Omit<
    UseQueryOptions<CustomerBalanceTableResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.customerBalanceSummary(query),
    queryFn: () => fetchCustomerBalanceTable(fetcher, query),
  });
}

export function useCustomerBalanceSummaryXlsxExport(
  query: CustomerBalanceXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchCustomerBalanceXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'customer_balance_summary.xlsx'),
      ),
  });
}

export function useCustomerBalanceSummaryCsvExport(
  query: CustomerBalanceCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchCustomerBalanceCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'customer_balance_summary.csv'),
      ),
  });
}

export function useCustomerBalanceSummaryPdf(query: CustomerBalancePdfQuery) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchCustomerBalancePdf(fetcher, query));
}
