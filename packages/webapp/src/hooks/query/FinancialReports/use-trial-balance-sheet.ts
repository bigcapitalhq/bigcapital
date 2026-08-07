import {
  fetchTrialBalanceTable,
  fetchTrialBalanceXlsx,
  fetchTrialBalanceCsv,
  fetchTrialBalancePdf,
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
  TrialBalanceTableQuery,
  TrialBalanceTableResponse,
  TrialBalanceXlsxQuery,
  TrialBalanceCsvQuery,
  TrialBalancePdfQuery,
} from '@bigcapital/sdk-ts';

export function useTrialBalanceSheet(
  query: TrialBalanceTableQuery,
  props?: Omit<
    UseQueryOptions<TrialBalanceTableResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.trialBalance(query),
    queryFn: () => fetchTrialBalanceTable(fetcher, query),
  });
}

export function useTrialBalanceSheetXlsxExport(
  query: TrialBalanceXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchTrialBalanceXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'trial_balance_sheet.xlsx'),
      ),
  });
}

export function useTrialBalanceSheetCsvExport(
  query: TrialBalanceCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchTrialBalanceCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'trial_balance_sheet.csv'),
      ),
  });
}

export function useTrialBalanceSheetPdf(query: TrialBalancePdfQuery) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchTrialBalancePdf(fetcher, query));
}
