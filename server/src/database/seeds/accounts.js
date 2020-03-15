
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('accounts').del()
    .then(() => {
      // Inserts seed entries
      return knex('accounts').insert([
        {
          id: 1,
          name: 'Petty Cash',
          account_type_id: 2,
          parent_account_id: null,
          code: '10000',
          description: '',
          active: 1,
          index: 1,
        },
        {
          id: 2,
          name: 'Bank',
          account_type_id: 2,
          parent_account_id: null,
          code: '20000',
          description: '',
          active: 1,
          index: 1,
        },
        {
          id: 3,
          name: 'Other Income',
          account_type_id: 7,
          parent_account_id: null,
          code: '1000',
          description: '',
          active: 1,
          index: 1,
        },
        {
          id: 4,
          name: 'Interest Income',
          account_type_id: 7,
          parent_account_id: null,
          code: '1000',
          description: '',
          active: 1,
          index: 1,
        },
        {
          id: 5,
          name: 'Opening Balance',
          account_type_id: 5,
          parent_account_id: null,
          code: '1000',
          description: '',
          active: 1,
          index: 1,
        },
        {
          id: 6,
          name: 'Depreciation Expense',
          account_type_id: 6,
          parent_account_id: null,
          code: '1000',
          description: '',
          active: 1,
          index: 1,
        },
        {
          id: 7,
          name: 'Interest Expense',
          account_type_id: 6,
          parent_account_id: null,
          code: '1000',
          description: '',
          active: 1,
          index: 1,
        },
        {
          id: 8,
          name: 'Payroll Expenses',
          account_type_id: 6,
          parent_account_id: null,
          code: '1000',
          description: '',
          active: 1,
          index: 1,
        },
        {
          id: 9,
          name: 'Other Expenses',
          account_type_id: 6,
          parent_account_id: null,
          code: '1000',
          description: '',
          active: 1,
          index: 1,
        }
      ]);
    });
};
