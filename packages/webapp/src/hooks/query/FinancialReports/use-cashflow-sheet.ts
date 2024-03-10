// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { useDownloadFile } from '../../useDownloadFile';
import { useRequestPdf } from '../../useRequestPdf';
import t from '../types';

/**
 * Retrieve cash flow statement report.
 */
export function useCashFlowStatementReport(query, props) {
  return useRequestQuery(
    [t.FINANCIAL_REPORT, t.CASH_FLOW_STATEMENT, query],
    {
      method: 'get',
      url: '/financial_statements/cash-flow',
      params: query,
      headers: {
        Accept: 'application/json+table',
      },
    },
    {
      select: (res) => ({
        columns: res.data.table.columns,
        query: res.data.query,
        meta: res.data.meta,
        tableRows: res.data.table.rows,
      }),
      defaultData: {
        tableRows: [],
        columns: [],
        query: {},
        meta: {},
      },
      ...props,
    },
  );
}

export const useCashFlowStatementXlsxExport = (query, args) => {
  const url = '/financial_statements/cash-flow';
  const config = {
    headers: {
      accept: 'application/xlsx',
    },
    params: query,
  };
  const filename = 'cashflow_statement.xlsx';

  return useDownloadFile({
    url,
    config,
    filename,
    ...args,
  });
};

export const useCashFlowStatementCsvExport = (query, args) => {
  const url = '/financial_statements/cash-flow';
  const config = {
    headers: {
      accept: 'application/csv',
    },
    params: query,
  };
  const filename = 'cashflow_statement.csv';

  return useDownloadFile({
    url,
    config,
    filename,
    ...args,
  });
};

/**
 * Retrieves the cashflow sheet pdf document.
 */
export function useCashflowSheetPdf(query = {}) {
  return useRequestPdf({
    url: `/financial_statements/cash-flow`,
    params: query,
  });
}
