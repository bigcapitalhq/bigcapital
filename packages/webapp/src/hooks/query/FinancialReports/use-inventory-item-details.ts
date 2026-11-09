import {
  fetchInventoryItemDetailsTable,
  fetchInventoryItemDetailsXlsx,
  fetchInventoryItemDetailsCsv,
  fetchInventoryItemDetailsPdf,
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
  InventoryItemDetailsTableQuery,
  InventoryItemDetailsTableResponse,
  InventoryItemDetailsXlsxQuery,
  InventoryItemDetailsCsvQuery,
  InventoryItemDetailsPdfQuery,
} from '@bigcapital/sdk-ts';

interface InventoryItemDetailsReport {
  columns: InventoryItemDetailsTableResponse['table']['columns'];
  query: InventoryItemDetailsTableResponse['query'];
  meta: InventoryItemDetailsTableResponse['meta'];
  tableRows: InventoryItemDetailsTableResponse['table']['rows'];
}

export function useInventoryItemDetailsReport(
  query: InventoryItemDetailsTableQuery,
  props?: Omit<
    UseQueryOptions<InventoryItemDetailsReport, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.inventoryItemDetails(query),
    queryFn: () =>
      fetchInventoryItemDetailsTable(fetcher, query).then((data) => ({
        columns: data.table.columns,
        query: data.query,
        meta: data.meta,
        tableRows: data.table.rows,
      })),
  });
}

export function useInventoryItemDetailsXlsxExport(
  query: InventoryItemDetailsXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchInventoryItemDetailsXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'inventory_item_details.xlsx'),
      ),
  });
}

export function useInventoryItemDetailsCsvExport(
  query: InventoryItemDetailsCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchInventoryItemDetailsCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'inventory_item_details.csv'),
      ),
  });
}

export function useInventoryItemDetailsPdf(
  query: InventoryItemDetailsPdfQuery,
) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchInventoryItemDetailsPdf(fetcher, query));
}
