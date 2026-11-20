import {
  fetchReconciliationStatusCsv,
  fetchReconciliationStatusPdf,
  fetchReconciliationStatusTable,
  fetchReconciliationStatusXlsx,
} from '@bigcapital/sdk-ts';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { downloadFile } from '../../useDownloadFile';
import { useApiFetcher } from '../../useRequest';
import { usePdfDocument } from '../../useRequestPdf';
import { financialReportsKeys } from './query-keys';
import type { ReconciliationStatusReportQuery } from '@bigcapital/sdk-ts';

export function useReconciliationStatus(
  query: ReconciliationStatusReportQuery,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    queryKey: financialReportsKeys.reconciliationStatus(query),
    queryFn: () => fetchReconciliationStatusTable(fetcher, query),
    placeholderData: keepPreviousData,
  });
}

export function useReconciliationStatusExport(
  query: ReconciliationStatusReportQuery,
) {
  const fetcher = useApiFetcher();

  return useMutation({
    mutationFn: async (format: 'csv' | 'xlsx') => {
      if (format === 'csv') {
        const csv = await fetchReconciliationStatusCsv(fetcher, query);
        downloadFile(
          csv,
          'reconciliation-status.csv',
          'text/csv;charset=utf-8',
          '\uFEFF',
        );
      } else {
        const xlsx = await fetchReconciliationStatusXlsx(fetcher, query);
        downloadFile(xlsx, 'reconciliation-status.xlsx', xlsx.type);
      }
    },
  });
}

export function useReconciliationStatusPdf(
  query: ReconciliationStatusReportQuery,
) {
  const fetcher = useApiFetcher();

  return usePdfDocument(async () => ({
    blob: await fetchReconciliationStatusPdf(fetcher, query),
    filename: 'reconciliation-status.pdf',
  }));
}
