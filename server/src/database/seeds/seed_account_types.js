
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('account_types').del()
    .then(() => {
      // Inserts seed entries
      return knex('account_types').insert([
        {
          id: 1,
          name: 'Fixed Asset',
          key: 'fixed_asset',
          normal: 'debit',
          root_type: 'asset',
          balance_sheet: true,
          income_sheet: false,
        },
        {
          id: 2,
          name: 'Current Asset',
          key: 'current_asset',
          normal: 'debit',
          root_type: 'asset',
          balance_sheet: true,
          income_sheet: false,
        },
        {
          id: 3,
          name: 'Long Term Liability',
          key: 'long_term_liability',
          normal: 'credit',
          root_type: 'liability',
          balance_sheet: false,
          income_sheet: true,
        },
        {
          id: 4,
          name: 'Current Liability',
          key: 'current_liability',
          normal: 'credit',
          root_type: 'liability',
          balance_sheet: false,
          income_sheet: true,
        },
        {
          id: 5,
          name: 'Equity',
          key: 'equity',
          normal: 'credit',
          root_type: 'equity',
          balance_sheet: true,
          income_sheet: false,
        },
        {
          id: 6,
          name: 'Expense',
          key: 'expense',
          normal: 'debit',
          root_type: 'expense',
          balance_sheet: false,
          income_sheet: true,
        },
        {
          id: 7,
          name: 'Income',
          key: 'income',
          normal: 'credit',
          root_type: 'income',
          balance_sheet: false,
          income_sheet: true,
        },
        {
          id: 8,
          name: 'Accounts Receivable',
          key: 'accounts_receivable',
          normal: 'debit',
          root_type: 'asset',
          balance_sheet: true,
          income_sheet: false,
        },
        {
          id: 9,
          name: 'Accounts Payable',
          key: 'accounts_payable',
          normal: 'credit',
          root_type: 'liability',
          balance_sheet: true,
          income_sheet: false,
        },
      ]);
    });
};
