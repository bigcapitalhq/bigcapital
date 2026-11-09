import {
  fetchGeneralLedgerTable,
  fetchGeneralLedgerXlsx,
  fetchGeneralLedgerCsv,
  fetchGeneralLedgerPdf,
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
  GeneralLedgerTableQuery,
  GeneralLedgerTableResponse,
  GeneralLedgerXlsxQuery,
  GeneralLedgerCsvQuery,
  GeneralLedgerPdfQuery,
} from '@bigcapital/sdk-ts';

export function useGeneralLedgerSheet(
  query: GeneralLedgerTableQuery,
  props?: Omit<
    UseQueryOptions<GeneralLedgerTableResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.generalLedger(query),
    queryFn: () => fetchGeneralLedgerTable(fetcher, query),
  });
}

export function useGeneralLedgerSheetXlsxExport(
  query: GeneralLedgerXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchGeneralLedgerXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'general_ledger.xlsx'),
      ),
  });
}

export function useGeneralLedgerSheetCsvExport(
  query: GeneralLedgerCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchGeneralLedgerCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'general_ledger.csv'),
      ),
  });
}

export function useGeneralLedgerPdf(query: GeneralLedgerPdfQuery) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchGeneralLedgerPdf(fetcher, query));
}
