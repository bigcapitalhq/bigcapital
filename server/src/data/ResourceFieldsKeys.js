/* eslint-disable quote-props */

export default {
  // Expenses.
  'expenses': {
    'expense_account': {
      column: ' ',
      relation: 'accounts.name',
    },
    'payment_account': {
      column: 'payment_account_id',
      relation: 'accounts.id',
    },
    'account_type': {
      column: 'account_type_id',
      relation: 'account_types.id',
    },
  },

  // Accounts
  'accounts': {
    'name': {
      column: 'name',
    },
    'type': {
      column: 'account_type_id',
      relation: 'account_types.id',
    },
    'description': {
      column: 'description',
    },
    'code': {
      column: 'code',
    },
  },
};
