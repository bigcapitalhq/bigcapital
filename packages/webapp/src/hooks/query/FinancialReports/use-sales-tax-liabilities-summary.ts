import {
  fetchSalesTaxLiabilityTable,
  fetchSalesTaxLiabilityJson,
  fetchSalesTaxLiabilityXlsx,
  fetchSalesTaxLiabilityCsv,
  fetchSalesTaxLiabilityPdf,
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
  SalesTaxLiabilityTableQuery,
  SalesTaxLiabilityTableResponse,
  SalesTaxLiabilityJsonQuery,
  SalesTaxLiabilityJsonResponse,
  SalesTaxLiabilityXlsxQuery,
  SalesTaxLiabilityCsvQuery,
  SalesTaxLiabilityPdfQuery,
} from '@bigcapital/sdk-ts';

export function useSalesTaxLiabilitySummary(
  query: SalesTaxLiabilityTableQuery,
  props?: Omit<
    UseQueryOptions<SalesTaxLiabilityTableResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: financialReportsKeys.salesTaxLiability(query),
    queryFn: () => fetchSalesTaxLiabilityTable(fetcher, query),
  });
}

/**
 * Retrieves the sales tax liability summary as JSON nodes rather than table
 * rows, for consumers that compute from the numbers (the homepage overview).
 */
export function useSalesTaxLiabilitySummaryJson(
  query: SalesTaxLiabilityJsonQuery,
  props?: Omit<
    UseQueryOptions<SalesTaxLiabilityJsonResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    // distinct from the table key: same query, different response shape.
    queryKey: [...financialReportsKeys.salesTaxLiability(query), 'json'],
    queryFn: () => fetchSalesTaxLiabilityJson(fetcher, query),
  });
}

export function useSalesTaxLiabilitySummaryXlsxExport(
  query: SalesTaxLiabilityXlsxQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchSalesTaxLiabilityXlsx(fetcher, query).then((blob) =>
        downloadFile(blob, 'sales_tax_liability_summary.xlsx'),
      ),
  });
}

export function useSalesTaxLiabilitySummaryCsvExport(
  query: SalesTaxLiabilityCsvQuery,
  args?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>,
) {
  const fetcher = useApiFetcher();
  return useMutation({
    ...args,
    mutationFn: () =>
      fetchSalesTaxLiabilityCsv(fetcher, query).then((blob) =>
        downloadFile(blob, 'sales_tax_liability_summary.csv'),
      ),
  });
}

export function useSalesTaxLiabilitySummaryPdf(
  query: SalesTaxLiabilityPdfQuery,
) {
  const fetcher = useApiFetcher();
  return useFetcherPdf(() => fetchSalesTaxLiabilityPdf(fetcher, query));
}
