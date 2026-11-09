import {
  fetchProfitLossTable,
  fetchProfitLossXlsx,
  fetchProfitLossCsv,
  fetchProfitLossPdf,
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
  ProfitLossTableQuery,
  ProfitLossTableResponse,
  ProfitLossXlsxQuery,
  ProfitLossCsvQuery,
  ProfitLossPdfQuery,
} from '@bigcapital/sdk-ts';

export function useProfitLossSheet(
  query: ProfitLossTableQuery,
  props?: Omit<
    UseQueryOptions<ProfitLossTableResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.profitLoss(query),
    queryFn: () => fetchProfitLossTable(fetcher, query),
  });
}

export function useProfitLossSheetXlsxExport(
  query: ProfitLossXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchProfitLossXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'profit_loss_sheet.xlsx'),
      ),
  });
}

export function useProfitLossSheetCsvExport(
  query: ProfitLossCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchProfitLossCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'profit_loss_sheet.csv'),
      ),
  });
}

export function useProfitLossSheetPdf(query: ProfitLossPdfQuery) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchProfitLossPdf(fetcher, query));
}
