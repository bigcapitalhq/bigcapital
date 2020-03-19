
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('account_types').del()
    .then(() => {
      // Inserts seed entries
      return knex('account_types').insert([
        {
          id: 1,
          name: 'Fixed Asset',
          normal: 'debit',
          balance_sheet: true,
          income_sheet: false,
        },
        {
          id: 2,
          name: 'Current Asset',
          normal: 'debit',
          balance_sheet: true,
          income_sheet: false,
        },
        {
          id: 3,
          name: 'Long Term Liability',
          normal: 'credit',
          balance_sheet: false,
          income_sheet: true,
        },
        {
          id: 4,
          name: 'Current Liability',
          normal: 'credit',
          balance_sheet: false,
          income_sheet: true,
        },
        {
          id: 5,
          name: 'Equity',
          normal: 'credit',
          balance_sheet: false,
          income_sheet: true,
        },
        {
          id: 6,
          name: 'Expense',
          normal: 'debit',
          balance_sheet: false,
          income_sheet: true,
        },
        {
          id: 7,
          name: 'Income',
          normal: 'credit',
          balance_sheet: false,
          income_sheet: true,
        },
        {
          id: 8,
          name: 'Accounts Receivable',
          normal: 'debit',
          balance_sheet: true,
          income_sheet: false,
        },
        {
          id: 9,
          name: 'Accounts Payable',
          normal: 'credit',
          balance_sheet: true,
          income_sheet: false,
        },
      ]);
    });
};
