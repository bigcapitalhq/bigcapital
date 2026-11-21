import {
  fetchReconciliationStatusCsv,
  fetchReconciliationStatusPdf,
  fetchReconciliationStatusTable,
  fetchReconciliationStatusXlsx,
} from '@bigcapital/sdk-ts';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import intl from 'react-intl-universal';
import { downloadFile } from '../../useDownloadFile';
import { useApiFetcher } from '../../useRequest';
import { usePdfDocument } from '../../useRequestPdf';
import { financialReportsKeys } from './query-keys';
import type { ReconciliationStatusReportQuery } from '@bigcapital/sdk-ts';
import { useAppIntlContext } from '@/components/AppIntlProvider';

export function useReconciliationStatus(
  query: ReconciliationStatusReportQuery,
) {
  const { currentLocale: locale } = useAppIntlContext();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true, locale });

  return useQuery({
    queryKey: [...financialReportsKeys.reconciliationStatus(query), locale],
    queryFn: () => fetchReconciliationStatusTable(fetcher, query),
    placeholderData: keepPreviousData,
  });
}

export function useReconciliationStatusExport(
  query: ReconciliationStatusReportQuery,
) {
  const { currentLocale: locale } = useAppIntlContext();
  const fetcher = useApiFetcher({ locale });

  return useMutation({
    mutationFn: async (format: 'csv' | 'xlsx') => {
      const filename = `${intl.get('report.reconciliation_status.filename')}.${format}`;
      if (format === 'csv') {
        const csv = await fetchReconciliationStatusCsv(fetcher, query);
        downloadFile(csv, filename, 'text/csv;charset=utf-8', '\uFEFF');
      } else {
        const xlsx = await fetchReconciliationStatusXlsx(fetcher, query);
        downloadFile(xlsx, filename, xlsx.type);
      }
    },
  });
}

export function useReconciliationStatusPdf(
  query: ReconciliationStatusReportQuery,
) {
  const { currentLocale: locale } = useAppIntlContext();
  const fetcher = useApiFetcher({ locale });

  return usePdfDocument(async () => ({
    blob: await fetchReconciliationStatusPdf(fetcher, query),
    filename: `${intl.get('report.reconciliation_status.filename')}.pdf`,
  }));
}
