import {
  fetchPayableAgingTable,
  fetchPayableAgingXlsx,
  fetchPayableAgingCsv,
  fetchPayableAgingPdf,
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
  PayableAgingTableQuery,
  PayableAgingTableResponse,
  PayableAgingXlsxQuery,
  PayableAgingCsvQuery,
  PayableAgingPdfQuery,
} from '@bigcapital/sdk-ts';

export function useAPAgingSummaryReport(
  query: PayableAgingTableQuery,
  props?: Omit<
    UseQueryOptions<PayableAgingTableResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.apAgingSummary(query),
    queryFn: () => fetchPayableAgingTable(fetcher, query),
  });
}

export function useAPAgingSheetXlsxExport(
  query: PayableAgingXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchPayableAgingXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'payable_aging_summary.xlsx'),
      ),
  });
}

export function useAPAgingSheetCsvExport(
  query: PayableAgingCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchPayableAgingCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'payable_aging_summary.csv'),
      ),
  });
}

export function useAPAgingSummaryPdf(query: PayableAgingPdfQuery) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchPayableAgingPdf(fetcher, query));
}
