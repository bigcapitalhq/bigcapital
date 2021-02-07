import { useQuery } from 'react-query';
import ApiService from 'services/ApiService';
import {
  trialBalanceSheetReducer,
  balanceSheetRowsReducer,
  profitLossSheetReducer,
  generalLedgerTableRowsReducer,
  journalTableRowsReducer,
} from 'containers/FinancialStatements/reducers';

const transformBalanceSheet = (response) => {
  return {
    tableRows: balanceSheetRowsReducer(response.data.data),
    ...response.data,
  };
};

const transformTrialBalance = (response) => {
  return {
    tableRows: trialBalanceSheetReducer(response.data.data),
    ...response.data,
  };
};

const transformProfitLoss = (response) => {
  return {
    tableRows: profitLossSheetReducer(response.data.data),
    ...response.data,
  };
};

const transformGeneralLedger = (response) => {
  return {
    tableRows: generalLedgerTableRowsReducer(response.data.data),
    ...response.data,
  };
};

const transformJournal = (response) => {
  return {
    tableRows: journalTableRowsReducer(response.data.data),
    ...response.data,
  };
};

export function useBalanceSheet(query, props) {
  return useQuery(
    ['FINANCIAL-REPORT', 'BALANCE-SHEET', query],
    () =>
      ApiService.get('/financial_statements/balance_sheet', {
        params: query,
      }).then(transformBalanceSheet),
    {
      initialData: {
        data: [],
        columns: [],
        query: {},
        tableRows: [],
      },
      ...props,
    },
  );
}

export function useTrialBalanceSheet(query, props) {
  return useQuery(
    ['FINANCIAL-REPORT', 'TRIAL-BALANCE-SHEET', query],
    () =>
      ApiService.get('/financial_statements/trial_balance_sheet', {
        params: query,
      }).then(transformTrialBalance),
    {
      initialData: {
        tableRows: [],
        data: [],
        query: {},
      },
      ...props,
    },
  );
}

export function useProfitLossSheet(query, props) {
  return useQuery(
    ['FINANCIAL-REPORT', 'PROFIT-LOSS-SHEET', query],
    () =>
      ApiService.get('/financial_statements/profit_loss_sheet', {
        params: query,
      }).then(transformProfitLoss),
    {
      initialData: {
        data: {},
        tableRows: [],
        columns: [],
        query: {},
      },
      ...props,
    },
  );
}

export function useGeneralLedgerSheet(query, props) {
  return useQuery(
    ['FINANCIAL-REPORT', 'GENERAL-LEDGER', query],
    () =>
      ApiService.get('/financial_statements/general_ledger', {
        params: query,
      }).then(transformGeneralLedger),
    {
      initialData: {
        tableRows: [],
        data: {},
        query: {}
      },
      ...props
    },
  );
}

export function useJournalSheet(query, props) {
  return useQuery(
    ['FINANCIAL-REPORT', 'JOURNAL', query],
    () =>
      ApiService.get('/financial_statements/journal', { params: query }).then(
        transformJournal,
      ),
    {
      initialData: {
        data: {},
        tableRows: [],
        query: {},
      },
      ...props
    },
  );
}

export function useARAgingSummaryReport(query, props) {
  return useQuery(
    ['FINANCIAL-REPORT', 'AR-AGING-SUMMARY', query],
    () =>
      ApiService.get('/financial_statements/receivable_aging_summary', {
        params: query,
      }),
    props,
  );
}
