import {
  fetchReceivableAgingTable,
  fetchReceivableAgingJson,
  fetchReceivableAgingXlsx,
  fetchReceivableAgingCsv,
  fetchReceivableAgingPdf,
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
  ReceivableAgingTableQuery,
  ReceivableAgingTableResponse,
  ReceivableAgingJsonQuery,
  ReceivableAgingJsonResponse,
  ReceivableAgingXlsxQuery,
  ReceivableAgingCsvQuery,
  ReceivableAgingPdfQuery,
} from '@bigcapital/sdk-ts';

export function useARAgingSummaryReport(
  query: ReceivableAgingTableQuery,
  props?: Omit<
    UseQueryOptions<ReceivableAgingTableResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.arAgingSummary(query),
    queryFn: () => fetchReceivableAgingTable(fetcher, query),
  });
}

/**
 * Retrieves the A/R aging summary as JSON nodes rather than table rows, for
 * consumers that compute from the numbers (the homepage overview).
 */
export function useARAgingSummaryJson(
  query: ReceivableAgingJsonQuery,
  props?: Omit<
    UseQueryOptions<ReceivableAgingJsonResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    // distinct from the table key: same query, different response shape.
    queryKey: [...financialReportsKeys.arAgingSummary(query), 'json'],
    queryFn: () => fetchReceivableAgingJson(fetcher, query),
  });
}

export function useARAgingSheetXlsxExport(
  query: ReceivableAgingXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchReceivableAgingXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'receivable_aging_summary.xlsx'),
      ),
  });
}

export function useARAgingSheetCsvExport(
  query: ReceivableAgingCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchReceivableAgingCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'receivable_aging_summary.csv'),
      ),
  });
}

export function useARAgingSummaryPdf(query: ReceivableAgingPdfQuery) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchReceivableAgingPdf(fetcher, query));
}
