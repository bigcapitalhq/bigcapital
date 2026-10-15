import {
  fetchBudgetVsActualTable,
  fetchBudgetVsActualXlsx,
  fetchBudgetVsActualCsv,
  fetchBudgetVsActualPdf,
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
  BudgetVsActualTableQuery,
  BudgetVsActualTableResponse,
  BudgetVsActualXlsxQuery,
  BudgetVsActualCsvQuery,
  BudgetVsActualPdfQuery,
} from '@bigcapital/sdk-ts';

export function useBudgetVsActualSummary(
  query: BudgetVsActualTableQuery,
  props?: Omit<
    UseQueryOptions<BudgetVsActualTableResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.budgetVsActual(query),
    queryFn: () => fetchBudgetVsActualTable(fetcher, query),
  });
}

export function useBudgetVsActualXlsxExport(
  query: BudgetVsActualXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchBudgetVsActualXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'budget_vs_actual.xlsx'),
      ),
  });
}

export function useBudgetVsActualCsvExport(
  query: BudgetVsActualCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchBudgetVsActualCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'budget_vs_actual.csv'),
      ),
  });
}

export function useBudgetVsActualPdf(query: BudgetVsActualPdfQuery) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchBudgetVsActualPdf(fetcher, query));
}
