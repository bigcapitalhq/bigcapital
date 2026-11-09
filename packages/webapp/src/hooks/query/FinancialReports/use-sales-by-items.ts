import {
  fetchSalesByItemsJson,
  fetchSalesByItemsTable,
  fetchSalesByItemsXlsx,
  fetchSalesByItemsCsv,
  fetchSalesByItemsPdf,
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
  SalesByItemsJsonQuery,
  SalesByItemsJsonResponse,
  SalesByItemsTableQuery,
  SalesByItemsTableResponse,
  SalesByItemsXlsxQuery,
  SalesByItemsCsvQuery,
  SalesByItemsPdfQuery,
} from '@bigcapital/sdk-ts';

export function useSalesByItems(
  query: SalesByItemsJsonQuery,
  props?: Omit<
    UseQueryOptions<SalesByItemsJsonResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.salesByItems(query),
    queryFn: () => fetchSalesByItemsJson(fetcher, query),
  });
}

export function useSalesByItemsTable(
  query: SalesByItemsTableQuery,
  props?: Omit<
    UseQueryOptions<SalesByItemsTableResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.salesByItems(query),
    queryFn: () => fetchSalesByItemsTable(fetcher, query),
  });
}

export function useSalesByItemsCsvExport(
  query: SalesByItemsCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchSalesByItemsCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'sales_by_items.csv'),
      ),
  });
}

export function useSalesByItemsXlsxExport(
  query: SalesByItemsXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchSalesByItemsXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'sales_by_items.xlsx'),
      ),
  });
}

export function useSalesByItemsPdfExport(query: SalesByItemsPdfQuery) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchSalesByItemsPdf(fetcher, query));
}
