import {
  fetchPurchasesByItemsJson,
  fetchPurchasesByItemsTable,
  fetchPurchasesByItemsXlsx,
  fetchPurchasesByItemsCsv,
  fetchPurchasesByItemsPdf,
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
  PurchasesByItemsJsonQuery,
  PurchasesByItemsJsonResponse,
  PurchasesByItemsTableQuery,
  PurchasesByItemsTableResponse,
  PurchasesByItemsXlsxQuery,
  PurchasesByItemsCsvQuery,
  PurchasesByItemsPdfQuery,
} from '@bigcapital/sdk-ts';

export function usePurchasesByItems(
  query: PurchasesByItemsJsonQuery,
  props?: Omit<
    UseQueryOptions<PurchasesByItemsJsonResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.purchasesByItems(query),
    queryFn: () => fetchPurchasesByItemsJson(fetcher, query),
  });
}

export function usePurchasesByItemsTable(
  query: PurchasesByItemsTableQuery,
  props?: Omit<
    UseQueryOptions<PurchasesByItemsTableResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.purchasesByItems(query),
    queryFn: () => fetchPurchasesByItemsTable(fetcher, query),
  });
}

export function usePurchasesByItemsCsvExport(
  query: PurchasesByItemsCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchPurchasesByItemsCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'purchases_by_items.csv'),
      ),
  });
}

export function usePurchasesByItemsXlsxExport(
  query: PurchasesByItemsXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchPurchasesByItemsXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'purchases_by_items.xlsx'),
      ),
  });
}

export function usePurchasesByItemsPdfExport(query: PurchasesByItemsPdfQuery) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchPurchasesByItemsPdf(fetcher, query));
}
