import {
  fetchInventoryTurnoverByAmountCsv,
  fetchInventoryTurnoverByAmountPdf,
  fetchInventoryTurnoverByAmountTable,
  fetchInventoryTurnoverByAmountXlsx,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { downloadFile } from '../../useDownloadFile';
import { useApiFetcher } from '../../useRequest';
import { useFetcherPdf } from '../../useRequestPdf';
import { financialReportsKeys } from './query-keys';
import type {
  InventoryTurnoverByAmountCsvQuery,
  InventoryTurnoverByAmountPdfQuery,
  InventoryTurnoverByAmountTableQuery,
  InventoryTurnoverByAmountTableResponse,
  InventoryTurnoverByAmountXlsxQuery,
} from '@bigcapital/sdk-ts';

export function useInventoryTurnoverByAmountTable(
  query: InventoryTurnoverByAmountTableQuery,
  props?: Omit<
    UseQueryOptions<InventoryTurnoverByAmountTableResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: financialReportsKeys.inventoryTurnoverByAmount(query),
    queryFn: () => fetchInventoryTurnoverByAmountTable(fetcher, query),
  });
}

export function useInventoryTurnoverByAmountXlsxExport(
  query: InventoryTurnoverByAmountXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();

  return useMutation({
    ...args,
    mutationFn: () =>
      fetchInventoryTurnoverByAmountXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'inventory_turnover_by_amount.xlsx'),
      ),
  });
}

export function useInventoryTurnoverByAmountCsvExport(
  query: InventoryTurnoverByAmountCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();

  return useMutation({
    ...args,
    mutationFn: () =>
      fetchInventoryTurnoverByAmountCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'inventory_turnover_by_amount.csv'),
      ),
  });
}

export function useInventoryTurnoverByAmountPdf(
  query: InventoryTurnoverByAmountPdfQuery,
) {
  const fetcher = useApiFetcher();

  return useFetcherPdf(() => fetchInventoryTurnoverByAmountPdf(fetcher, query));
}
