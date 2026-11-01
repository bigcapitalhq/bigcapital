import {
  fetchBalanceSheetTable,
  fetchBalanceSheetXlsx,
  fetchBalanceSheetCsv,
  fetchBalanceSheetPdf,
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
  BalanceSheetTableQuery,
  BalanceSheetTableResponse,
  BalanceSheetXlsxQuery,
  BalanceSheetCsvQuery,
  BalanceSheetPdfQuery,
} from '@bigcapital/sdk-ts';

export function useBalanceSheet(
  query: BalanceSheetTableQuery,
  props?: Omit<
    UseQueryOptions<BalanceSheetTableResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.balanceSheet(query),
    queryFn: () => fetchBalanceSheetTable(fetcher, query),
  });
}

export function useBalanceSheetXlsxExport(
  query: BalanceSheetXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchBalanceSheetXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'balance_sheet.xlsx'),
      ),
  });
}

export function useBalanceSheetCsvExport(
  query: BalanceSheetCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchBalanceSheetCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'balance_sheet.csv'),
      ),
  });
}

export function useBalanceSheetPdf(query: BalanceSheetPdfQuery) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchBalanceSheetPdf(fetcher, query));
}
