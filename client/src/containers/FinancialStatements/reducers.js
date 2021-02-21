import { chain } from 'lodash';
import moment from 'moment';

export const balanceSheetRowsReducer = (accounts) => {
  return accounts.map((account) => {
    return {
      ...account,
      children: balanceSheetRowsReducer([
        ...(account.children ? account.children : []),
        ...(account.total && account.children && account.children.length > 0
          ? [
              {
                name: `Total ${account.name}`,
                row_types: ['total-row', account.section_type],
                total: { ...account.total },
                ...(account.total_periods && {
                  total_periods: account.total_periods,
                }),
              },
            ]
          : []),
      ]),
    };
  });
};

export const trialBalanceSheetReducer = (sheet) => {
  const results = [];

  if (sheet.accounts) {
    sheet.accounts.forEach((account) => {
      results.push(account);
    });
  }
  if (sheet.total) {
    results.push({
      rowType: 'total',
      ...sheet.total,
    });
  }
  return results;
};

export const profitLossSheetReducer = (profitLoss) => {
  const results = [];

  if (profitLoss.income) {
    results.push({
      name: 'Income',
      total: profitLoss.income.total,
      children: [
        ...profitLoss.income.accounts,
        {
          name: 'Total Income',
          total: profitLoss.income.total,
          total_periods: profitLoss.income.total_periods,
          rowTypes: ['income_total', 'section_total', 'total'],
        },
      ],
      total_periods: profitLoss.income.total_periods,
    });
  }
  if (profitLoss.cost_of_sales) {
    results.push({
      name: 'Cost of sales',
      total: profitLoss.cost_of_sales.total,
      children: [
        ...profitLoss.cost_of_sales.accounts,
        {
          name: 'Total cost of sales',
          total: profitLoss.cost_of_sales.total,
          total_periods: profitLoss.cost_of_sales.total_periods,
          rowTypes: ['cogs_total', 'section_total', 'total'],
        },
      ],
      total_periods: profitLoss.cost_of_sales.total_periods,
    });
  }
  if (profitLoss.gross_profit) {
    results.push({
      name: 'Gross profit',
      total: profitLoss.gross_profit.total,
      total_periods: profitLoss.gross_profit.total_periods,
      rowTypes: ['gross_total', 'section_total', 'total'],
    });
  }
  if (profitLoss.expenses) {
    results.push({
      name: 'Expenses',
      total: profitLoss.expenses.total,
      children: [
        ...profitLoss.expenses.accounts,
        {
          name: 'Total Expenses',
          total: profitLoss.expenses.total,
          total_periods: profitLoss.expenses.total_periods,
          rowTypes: ['expenses_total', 'section_total', 'total'],
        },
      ],
      total_periods: profitLoss.expenses.total_periods,
    });
  }
  if (profitLoss.operating_profit) {
    results.push({
      name: 'Net Operating income',
      total: profitLoss.operating_profit.total,
      total_periods: profitLoss.income.total_periods,
      rowTypes: ['net_operating_total', 'section_total', 'total'],
    });
  }
  if (profitLoss.other_income) {
    results.push({
      name: 'Other Income',
      total: profitLoss.other_income.total,
      total_periods: profitLoss.other_income.total_periods,
      children: [
        ...profitLoss.other_income.accounts,
        {
          name: 'Total other income',
          total: profitLoss.other_income.total,
          total_periods: profitLoss.other_income.total_periods,
          rowTypes: ['expenses_total', 'section_total', 'total'],
        },
      ],
    });
  }
  if (profitLoss.other_expenses) {
    results.push({
      name: 'Other expenses',
      total: profitLoss.other_expenses.total,
      total_periods: profitLoss.other_expenses.total_periods,
      children: [
        ...profitLoss.other_expenses.accounts,
        {
          name: 'Total other expenses',
          total: profitLoss.other_expenses.total,
          total_periods: profitLoss.other_expenses.total_periods,
          rowTypes: ['expenses_total', 'section_total', 'total'],
        },
      ],
    });
  }
  if (profitLoss.net_income) {
    results.push({
      name: 'Net Income',
      total: profitLoss.net_income.total,
      total_periods: profitLoss.net_income.total_periods,
      rowTypes: ['net_income_total', 'section_total', 'total'],
    });
  }
  return results;
};

export const journalTableRowsReducer = (journal) => {
  const TYPES = {
    ENTRY: 'ENTRY',
    TOTAL_ENTRIES: 'TOTAL_ENTRIES',
    EMPTY_ROW: 'EMPTY_ROW',
  };

  const entriesMapper = (transaction) => {
    return transaction.entries.map((entry, index) => ({
      ...(index === 0
        ? {
            date: transaction.date,
            reference_type: transaction.reference_type,
            reference_id: transaction.reference_id,
            reference_type_formatted: transaction.reference_type_formatted,
          }
        : {}),
      rowType: TYPES.ENTRY,
      ...entry,
    }));
  };

  return chain(journal)
    .map((transaction) => {
      const entries = entriesMapper(transaction);

      return [
        ...entries,
        {
          rowType: TYPES.TOTAL_ENTRIES,
          currency_code: transaction.currency_code,
          credit: transaction.credit,
          debit: transaction.debit,
          formatted_credit: transaction.formatted_credit,
          formatted_debit: transaction.formatted_debit,
        },
        {
          rowType: TYPES.EMPTY_ROW,
        },
      ];
    })
    .flatten()
    .value();
};

export const generalLedgerTableRowsReducer = (accounts) => {
  return chain(accounts)
    .map((account) => {
      return {
        name: '',
        code: account.code,
        rowType: 'ACCOUNT_ROW',
        date: account.name,
        children: [
          {
            ...account.opening_balance,
            name: 'Opening balance',
            rowType: 'OPENING_BALANCE',
          },
          ...account.transactions.map((transaction) => ({
            ...transaction,
            name: account.name,
            code: account.code,
            date: moment(transaction.date).format('DD MMM YYYY'),
          })),
          {
            ...account.closing_balance,
            name: 'Closing balance',
            rowType: 'CLOSING_BALANCE',
          },
        ],
      };
    })
    .value();
};

export const ARAgingSummaryTableRowsMapper = (sheet, total) => {
  const rows = [];

  const mapAging = (agingPeriods) => {
    return agingPeriods.reduce((acc, aging, index) => {
      acc[`aging-${index}`] = aging.total.formatted_amount;
      return acc;
    }, {});
  };
  sheet.customers.forEach((customer) => {
    const agingRow = mapAging(customer.aging);

    rows.push({
      rowType: 'customer',
      name: customer.customer_name,
      ...agingRow,
      current: customer.current.formatted_amount,
      total: customer.total.formatted_amount,
    });
  });
  if (rows.length <= 0) {
    return [];
  }
  return [
    ...rows,
    {
      name: '',
      rowType: 'total',
      current: sheet.total.current.formatted_amount,
      ...mapAging(sheet.total.aging),
      total: sheet.total.total.formatted_amount,
    },
  ];
};
