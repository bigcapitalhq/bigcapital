import {
  fetchInventoryValuationJson,
  fetchInventoryValuationTable,
  fetchInventoryValuationXlsx,
  fetchInventoryValuationCsv,
  fetchInventoryValuationPdf,
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
  InventoryValuationJsonQuery,
  InventoryValuationJsonResponse,
  InventoryValuationTableQuery,
  InventoryValuationTableResponse,
  InventoryValuationXlsxQuery,
  InventoryValuationCsvQuery,
  InventoryValuationPdfQuery,
} from '@bigcapital/sdk-ts';

export function useInventoryValuation(
  query: InventoryValuationJsonQuery,
  props?: Omit<
    UseQueryOptions<InventoryValuationJsonResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.inventoryValuation(query),
    queryFn: () => fetchInventoryValuationJson(fetcher, query),
  });
}

export function useInventoryValuationTable(
  query: InventoryValuationTableQuery,
  props?: Omit<
    UseQueryOptions<InventoryValuationTableResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.inventoryValuation(query),
    queryFn: () => fetchInventoryValuationTable(fetcher, query),
  });
}

export function useInventoryValuationXlsxExport(
  query: InventoryValuationXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchInventoryValuationXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'inventory_valuation.xlsx'),
      ),
  });
}

export function useInventoryValuationCsvExport(
  query: InventoryValuationCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchInventoryValuationCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'inventory_valuation.csv'),
      ),
  });
}

export function useInventoryValuationPdf(query: InventoryValuationPdfQuery) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchInventoryValuationPdf(fetcher, query));
}
