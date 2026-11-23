import {
  fetchInventorySummaryJson,
  fetchInventorySummaryTable,
  fetchInventorySummaryXlsx,
  fetchInventorySummaryCsv,
  fetchInventorySummaryPdf,
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
  InventorySummaryJsonQuery,
  InventorySummaryJsonResponse,
  InventorySummaryTableQuery,
  InventorySummaryTableResponse,
  InventorySummaryXlsxQuery,
  InventorySummaryCsvQuery,
  InventorySummaryPdfQuery,
} from '@bigcapital/sdk-ts';

export function useInventorySummary(
  query: InventorySummaryJsonQuery,
  props?: Omit<
    UseQueryOptions<InventorySummaryJsonResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.inventorySummary(query),
    queryFn: () => fetchInventorySummaryJson(fetcher, query),
  });
}

export function useInventorySummaryTable(
  query: InventorySummaryTableQuery,
  props?: Omit<
    UseQueryOptions<InventorySummaryTableResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.inventorySummary(query),
    queryFn: () => fetchInventorySummaryTable(fetcher, query),
  });
}

export function useInventorySummaryXlsxExport(
  query: InventorySummaryXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchInventorySummaryXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'inventory_summary.xlsx'),
      ),
  });
}

export function useInventorySummaryCsvExport(
  query: InventorySummaryCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchInventorySummaryCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'inventory_summary.csv'),
      ),
  });
}

export function useInventorySummaryPdf(query: InventorySummaryPdfQuery) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchInventorySummaryPdf(fetcher, query));
}
