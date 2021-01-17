import { omit } from 'lodash';

export const mapBalanceSheetToTableRows = (accounts) => {
  return accounts.map((account) => {
    const PRIMARY_SECTIONS = ['assets', 'liability', 'equity'];
    const rowTypes = [
      'total_row',
      ...(PRIMARY_SECTIONS.indexOf(account.section_type) !== -1
        ? ['total_assets']
        : []),
    ];
    return {
      ...account,
      children: mapBalanceSheetToTableRows([
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

export const journalToTableRowsMapper = (journal) => {
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


export const generalLedgerToTableRows = (accounts) => {
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
      name: 'Total Aged Receivable',
      rowType: 'total',
      current: sheet.total.current.formatted_amount,
      ...mapAging(sheet.total.aging),
      total: sheet.total.total.formatted_amount,
    } 
  ];
};

export const mapTrialBalanceSheetToRows = (sheet) => {
  return [
    ...sheet.accounts,
    {
      name: 'Total',
      rowTypes: ['total'],
      ...sheet.total,
    },
  ];
};

export const profitLossToTableRowsMapper = (profitLoss) => {

  return [
    {
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
    },
    {
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
      total_periods: profitLoss.cost_of_sales.total_periods
    },
    {
      name: 'Gross profit',
      total: profitLoss.gross_profit.total,
      total_periods: profitLoss.gross_profit.total_periods,
      rowTypes: ['gross_total', 'section_total', 'total'],
    },
    {
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
    },
    {
      name: 'Net Operating income',
      total: profitLoss.operating_profit.total,
      total_periods: profitLoss.income.total_periods,
      rowTypes: ['net_operating_total', 'section_total', 'total'],
    },
    {
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
    },
    {
      name: 'Net Income',
      total: profitLoss.net_income.total,
      total_periods: profitLoss.net_income.total_periods,
      rowTypes: ['net_income_total', 'section_total', 'total'],
    },
  ];
};