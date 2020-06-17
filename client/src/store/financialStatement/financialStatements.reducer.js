import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';
import {
  getFinancialSheetIndexByQuery,
} from './financialStatements.selectors';
import { omit } from 'lodash';

const initialState = {
  balanceSheet: {
    sheets: [],
    loading: true,
    filter: true,
    refresh: false,
  },
  trialBalance: {
    sheets: [],
    loading: true,
    filter: true,
    refresh: false,
  },
  generalLedger: {
    sheets: [],
    loading: false,
    filter: true,
    refresh: false,
  },
  journal: {
    sheets: [],
    loading: false,
    tableRows: [],
    filter: true,
    refresh: true,
  },
  profitLoss: {
    sheets: [],
    loading: true,
    tableRows: [],
    filter: true,
  },
  receivableAgingSummary: {
    sheets: [],
    loading: false,
    tableRows: [],
    filter: true,
    refresh: false,
  },
};

const mapGeneralLedgerAccountsToRows = (accounts) => {
  return accounts.reduce((tableRows, account) => {
    const children = [];
    children.push({
      ...account.opening,
      rowType: 'opening_balance',
    });
    account.transactions.map((transaction) => {
      children.push({
        ...transaction,
        ...omit(account, ['transactions']),
        rowType: 'transaction',
      });
    });
    children.push({
      ...account.closing,
      rowType: 'closing_balance',
    });
    tableRows.push({
      ...omit(account, ['transactions']),
      children,
      rowType: 'account_name',
    });
    return tableRows;
  }, []);
};

const mapJournalTableRows = (journal) => {
  return journal.reduce((rows, journal) => {
    journal.entries.forEach((entry, index) => {
      rows.push({
        ...entry,
        rowType: index === 0 ? 'first_entry' : 'entry',
      });
    });
    rows.push({
      credit: journal.credit,
      debit: journal.debit,
      rowType: 'entries_total',
    });
    rows.push({
      rowType: 'space_entry',
    });
    return rows;
  }, []);
};


const mapContactAgingSummary = sheet => {
  const rows = [];

  const mapAging = (agingPeriods) => {
    return agingPeriods.reduce((acc, aging, index) => {
      acc[`aging-${index}`] = aging.formatted_total;
      return acc;
    }, {});
  }
  sheet.customers.forEach((customer) => {
    const agingRow = mapAging(customer.aging);
  
    rows.push({
      rowType: 'customer',
      customer_name: customer.customer_name,
      ...agingRow,
      total: customer.total,
    });
  });
 
  rows.push({
    rowType: 'total',
    customer_name: 'Total',
    ...mapAging(sheet.total),
    total: 0,
  });
  return rows;
};

const mapProfitLossToTableRows = (profitLoss) => {
  return [
    {
      name: 'Income',
      total: profitLoss.income.total,
      children: [
        ...profitLoss.income.accounts,
        {
          name: 'Total Income',
          total: profitLoss.income.total,
          rowType: 'income_total',
        },
      ],
    },
    {
      name: 'Expenses',
      total: profitLoss.expenses.total,
      children: [
        ...profitLoss.expenses.accounts,
        {
          name: 'Total Expenses',
          total: profitLoss.expenses.total,
          rowType: 'expense_total',
        },
      ],
    },
    {
      name: 'Net Income',
      total: profitLoss.net_income.total,
      rowType: 'net_income',
    },
  ];
};

const financialStatementFilterToggle = (financialName, statePath) => {
  return {
    [`${financialName}_FILTER_TOGGLE`]: (state, action) => {
      state[statePath].filter = !state[statePath].filter;
    },
  };
};

export default createReducer(initialState, {
  [t.BALANCE_SHEET_STATEMENT_SET]: (state, action) => {
    const index = getFinancialSheetIndexByQuery(
      state.balanceSheet.sheets,
      action.query,
    );

    const balanceSheet = {
      accounts: action.data.accounts,
      columns: Object.values(action.data.columns),
      query: action.data.query,
    };
    if (index !== -1) {
      state.balanceSheet.sheets[index] = balanceSheet;
    } else {
      state.balanceSheet.sheets.push(balanceSheet);
    }
  },

  [t.BALANCE_SHEET_LOADING]: (state, action) => {
    state.balanceSheet.loading = !!action.loading;
  },

  [t.BALANCE_SHEET_REFRESH]: (state, action) => {
    const { refresh } = action.payload;
    state.balanceSheet.refresh = refresh;
  },

  ...financialStatementFilterToggle('BALANCE_SHEET', 'balanceSheet'),

  [t.TRAIL_BALANCE_STATEMENT_SET]: (state, action) => {
    const index = getFinancialSheetIndexByQuery(
      state.trialBalance.sheets,
      action.query,
    );
    const trailBalanceSheet = {
      accounts: action.data.accounts,
      query: action.data.query,
    };
    if (index !== -1) {
      state.trialBalance.sheets[index] = trailBalanceSheet;
    } else {
      state.trialBalance.sheets.push(trailBalanceSheet);
    }
  },

  [t.TRIAL_BALANCE_SHEET_LOADING]: (state, action) => {
    state.trialBalance.loading = !!action.loading;
  },

  [t.TRIAL_BALANCE_REFRESH]: (state, action) => {
    const { refresh } = action.payload;
    state.trialBalance.refresh = refresh;
  },

  ...financialStatementFilterToggle('TRIAL_BALANCE', 'trialBalance'),

  [t.JOURNAL_SHEET_SET]: (state, action) => {
    const index = getFinancialSheetIndexByQuery(
      state.journal.sheets,
      action.query,
    );

    const journal = {
      query: action.data.query,
      journal: action.data.journal,
      tableRows: mapJournalTableRows(action.data.journal),
    };
    if (index !== -1) {
      state.journal.sheets[index] = journal;
    } else {
      state.journal.sheets.push(journal);
    }
  },

  [t.JOURNAL_SHEET_LOADING]: (state, action) => {
    state.journal.loading = !!action.loading;
  },
  [t.JOURNAL_SHEET_REFRESH]: (state, action) => {
    const { refresh } = action.payload;
    state.journal.refresh = !!refresh;
  },
  ...financialStatementFilterToggle('JOURNAL', 'journal'),

  [t.GENERAL_LEDGER_STATEMENT_SET]: (state, action) => {
    const index = getFinancialSheetIndexByQuery(
      state.generalLedger.sheets,
      action.query,
    );

    const generalLedger = {
      query: action.data.query,
      accounts: action.data.accounts,
      tableRows: mapGeneralLedgerAccountsToRows(action.data.accounts),
    };
    if (index !== -1) {
      state.generalLedger.sheets[index] = generalLedger;
    } else {
      state.generalLedger.sheets.push(generalLedger);
    }
  },

  [t.GENERAL_LEDGER_SHEET_LOADING]: (state, action) => {
    state.generalLedger.loading = !!action.loading;
  },
  [t.GENERAL_LEDGER_REFRESH]: (state, action) => {
    const { refresh } = action.payload;
    state.generalLedger.refresh = !!refresh;
  },
  ...financialStatementFilterToggle('GENERAL_LEDGER', 'generalLedger'),

  [t.PROFIT_LOSS_SHEET_SET]: (state, action) => {
    const index = getFinancialSheetIndexByQuery(
      state.profitLoss.sheets,
      action.query,
    );

    const profitLossSheet = {
      query: action.query,
      profitLoss: action.profitLoss,
      columns: action.columns,
      tableRows: mapProfitLossToTableRows(action.profitLoss),
    };
    if (index !== -1) {
      state.profitLoss.sheets[index] = profitLossSheet;
    } else {
      state.profitLoss.sheets.push(profitLossSheet);
    }
  },

  [t.PROFIT_LOSS_SHEET_LOADING]: (state, action) => {
    state.profitLoss.loading = !!action.loading;
  },

  [t.PROFIT_LOSS_REFRESH]: (state, action) => {
    const { refresh } = action.payload;
    state.profitLoss.refresh = !!refresh;
  },

  ...financialStatementFilterToggle('PROFIT_LOSS', 'profitLoss'),

  [t.RECEIVABLE_AGING_SUMMARY_LOADING]: (state, action) => {
    const { loading } = action.payload;
    state.receivableAgingSummary.loading = loading;
  },

  [t.RECEIVABLE_AGING_SUMMARY_SET]: (state, action) => {
    const { aging, columns, query } = action.payload;
    const index = getFinancialSheetIndexByQuery(state.receivableAgingSummary.sheets, query);

    const receivableSheet = {
      query,
      columns,
      aging,
      tableRows: mapContactAgingSummary(aging)
    };
    if (index !== -1) {
      state.receivableAgingSummary[index] = receivableSheet;
    } else {
      state.receivableAgingSummary.sheets.push(receivableSheet);
    }
  },
  [t.RECEIVABLE_AGING_SUMMARY_REFRESH]: (state, action) => {
    const { refresh } = action.payload;
    state.receivableAgingSummary.refresh = !!refresh;
  },
  ...financialStatementFilterToggle('RECEIVABLE_AGING_SUMMARY', 'receivableAgingSummary'),
});
