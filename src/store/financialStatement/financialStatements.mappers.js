import { omit, chain } from 'lodash';
import moment from 'moment';

export const mapBalanceSheetToTableRows = (accounts) => {
  return accounts.map((account) => {
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

export const profitLossToTableRowsMapper = () => {};

export const journalToTableRowsMapper = (journal) => {
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

export const generalLedgerToTableRows = (accounts) => {
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

export const APAgingSummaryTableRowsMapper = (sheet, total) => {
  const rows = [];

  const mapAging = (agingPeriods) => {
    return agingPeriods.reduce((acc, aging, index) => {
      acc[`aging-${index}`] = aging.total.formatted_amount;
      return acc;
    }, {});
  };
  sheet.vendors.forEach((vendor) => {
    const agingRow = mapAging(vendor.aging);

    rows.push({
      rowType: 'vendor',
      name: vendor.vendor_name,
      ...agingRow,
      current: vendor.current.formatted_amount,
      total: vendor.total.formatted_amount,
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

export const mapTrialBalanceSheetToRows = (sheet) => {
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
