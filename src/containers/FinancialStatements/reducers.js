import React from 'react';
import { chain } from 'lodash';
import moment from 'moment';
import { FormattedMessage as T } from 'components';

export const trialBalanceSheetReducer = (sheet) => {
  const results = [];

  if (sheet.accounts) {
    sheet.accounts.forEach((account) => {
      results.push(account);
    });
  }
  if (sheet.total) {
    results.push({
      row_types: 'total',
      ...sheet.total,
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
        row_types: 'ACCOUNT_ROW',
        date: account.name,
        children: [
          {
            ...account.opening_balance,
            name: <T id={'opening_balance'} />,
            row_types: 'OPENING_BALANCE',
            date: moment(account.opening_balance.date).format('DD MMM YYYY'),
          },
          ...account.transactions.map((transaction) => ({
            ...transaction,
            name: account.name,
            code: account.code,
            date: moment(transaction.date).format('DD MMM YYYY'),
          })),
          {
            ...account.closing_balance,
            name: <T id={'closing_balance'} />,
            row_types: 'CLOSING_BALANCE',
            date: moment(account.closing_balance.date).format('DD MMM YYYY'),
          },
        ],
        amount: account.closing_balance.amount,
        formatted_amount: account.closing_balance.formatted_amount,
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

export const inventoryValuationReducer = (sheet) => {
  const results = [];

  if (sheet.items) {
    sheet.items.forEach((item) => {
      results.push(item);
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

export const purchasesByItemsReducer = (sheet) => {
  const results = [];

  if (sheet.items) {
    sheet.items.forEach((item) => {
      results.push(item);
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
export const salesByItemsReducer = (sheet) => {
  const results = [];

  if (sheet.items) {
    sheet.items.forEach((item) => {
      results.push(item);
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
