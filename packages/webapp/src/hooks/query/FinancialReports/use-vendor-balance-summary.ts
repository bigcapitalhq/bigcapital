import {
  fetchVendorBalanceTable,
  fetchVendorBalanceXlsx,
  fetchVendorBalanceCsv,
  fetchVendorBalancePdf,
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
  VendorBalanceTableQuery,
  VendorBalanceTableResponse,
  VendorBalancePdfQuery,
} from '@bigcapital/sdk-ts';

interface VendorsBalanceSummaryReport {
  query: VendorBalanceTableResponse['query'];
  table: VendorBalanceTableResponse['table'];
  meta: VendorBalanceTableResponse['meta'];
}

export function useVendorsBalanceSummaryReport(
  query: VendorBalanceTableQuery,
  props?: Omit<
    UseQueryOptions<VendorsBalanceSummaryReport, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.vendorBalanceSummary(query),
    queryFn: () =>
      fetchVendorBalanceTable(fetcher, query).then((data) => ({
        query: data.query,
        table: data.table,
        meta: data.meta,
      })),
  });
}

export function useVendorBalanceSummaryXlsxExport(
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchVendorBalanceXlsx(fetcher, {}).then((blob) =>
        downloadFile(blob, 'vendor_balance_summary.xlsx'),
      ),
  });
}

export function useVendorBalanceSummaryCsvExport(
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchVendorBalanceCsv(fetcher, {}).then((blob) =>
        downloadFile(blob, 'vendor_balance_summary.csv'),
      ),
  });
}

export function useVendorBalanceSummaryPdfExport(query: VendorBalancePdfQuery) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchVendorBalancePdf(fetcher, query));
}
