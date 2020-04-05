import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';
import {
  // getBalanceSheetIndexByQuery,
  getFinancialSheetIndexByQuery,
  // getFinancialSheetIndexByQuery,
} from './financialStatements.selectors';
import {omit} from 'lodash';

const initialState = {
  balanceSheet: {
    sheets: [],
    loading: false,
  },
  trialBalance: {
    sheets: [],
    loading: false,
  },
  generalLedger: {
    sheets: [],
    loading: false,
  },
  journal: {
    sheets: [],
    loading: false,
    tableRows: [],
  },
  profitLoss: {
    sheets: [],
    loading: false,
    tableRows: [],
  }
};

const mapGeneralLedgerAccountsToRows = (accounts) => {
  return accounts.reduce((tableRows, account) => {
    const children = [];
    children.push({
      ...account.opening, rowType: 'opening_balance',
    });
    account.transactions.map((transaction) => {
      children.push({
        ...transaction, ...omit(account, ['transactions']),
        rowType: 'transaction'
      });
    });
    children.push({
      ...account.closing, rowType: 'closing_balance',
    });
    tableRows.push({
      ...omit(account, ['transactions']), children,
      rowType: 'account_name',
    });
    return tableRows;
  }, []);
}

const mapJournalTableRows = (journal) => {
  return journal.reduce((rows, journal) => {
    journal.entries.forEach((entry, index) => {
      rows.push({
        ...entry,
        rowType: (index === 0) ? 'first_entry' : 'entry'
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
}


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
        }
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
        }
      ],
    },
    {
      name: 'Net Income',
      total: profitLoss.net_income.total, 
      rowType: 'net_income',
    }
  ]
};

export default createReducer(initialState, {
  [t.BALANCE_SHEET_STATEMENT_SET]: (state, action) => {
    const index  = getFinancialSheetIndexByQuery(state.balanceSheet.sheets, action.query);
  
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

  [t.TRAIL_BALANCE_STATEMENT_SET]: (state, action) => {
    const index = getFinancialSheetIndexByQuery(state.trialBalance.sheets, action.query);
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

  [t.JOURNAL_SHEET_SET]: (state, action) => {
    const index = getFinancialSheetIndexByQuery(state.journal.sheets, action.query);

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

  [t.GENERAL_LEDGER_STATEMENT_SET]: (state, action) => {
    const index = getFinancialSheetIndexByQuery(state.generalLedger.sheets, action.query);
    
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

  [t.PROFIT_LOSS_SHEET_SET]: (state, action) => {
    const index = getFinancialSheetIndexByQuery(state.profitLoss.sheets, action.query);

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
});