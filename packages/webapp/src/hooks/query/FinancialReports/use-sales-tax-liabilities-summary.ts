// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

/**
 * Retrieves the sales tax liability summary report.
 */
export function useSalesTaxLiabilitySummary(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.SALES_TAX_LIABILITY_SUMMARY, query],
    {
      method: 'get',
      url: '/financial_statements/sales-tax-liability-summary',
      params: query,
      headers: {
        Accept: 'application/json+table',
      },
    },
    {
      select: (res) => res.data,
      ...props,
    },
  );
}

export const useSalesTaxLiabilitySummaryXlsxExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/sales-tax-liability-summary',
    config: {
      headers: {
        accept: 'application/xlsx',
      },
      params: query,
    },
    filename: 'sales_tax_liability_summary.xlsx',
    ...args,
  });
};

export const useSalesTaxLiabilitySummaryCsvExport = (query, args) => {
  return useDownloadFile({
    url: '/financial_statements/sales-tax-liability-summary',
    config: {
      headers: {
        accept: 'application/csv',
      },
      params: query,
    },
    filename: 'sales_tax_liability_summary.csv',
    ...args,
  });
};

/**
 * Retrieves pdf document data of sales tax liability summary.
 */
export function useSalesTaxLiabilitySummaryPdf(query = {}) {
  return useRequestPdf({
    url: `/financial_statements/sales-tax-liability-summary`,
    params: query,
  });
}
