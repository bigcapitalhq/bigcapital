/* eslint-disable quote-props */

export default {
  // Expenses.
  'expenses': {
    payment_date: {
      column: 'payment_date',
    },
    payment_account: {
      column: 'payment_account_id',
      relation: 'accounts.id',
    },
    total_amount: {
      column: 'total_amount',
    },
    reference_no: {
      column: 'reference_no'
    },
    description: {
      column: 'description',
    },
    published: {
      column: 'published',
    },
    user: {
      column: 'user_id',
      relation: 'users.id',
      relationColumn: 'users.id',
    },
  },

  // Accounts
  'accounts': {
    name: {
      column: 'name',
    },
    type: {
      column: 'account_type_id',
      relation: 'account_types.id',
      relationColumn: 'account_types.key',
    },
    description: {
      column: 'description',
    },
    code: {
      column: 'code',
    },
    root_type: {
      column: 'account_type_id',
      relation: 'account_types.id',
      relationColumn: 'account_types.root_type',
    },
    created_at: {
      column: 'created_at',
      columnType: 'date',
    },
    active: {
      column: 'active', 
    },
    balance: {
      column: 'amount',
      columnType: 'number'
    },
    currency: {
      column: 'currency_code',
    },
    normal: {
      column: 'account_type_id',
      relation: 'account_types.id',
      relationColumn: 'account_types.normal'
    },
  },

  // Items
  'items': {
    'type': {
      column: 'type',
    },
    'name': {
      column: 'name',
    },
  },

  // Manual Journals
  manual_journals: {
    date: {
      column: 'date',
    },
    created_at: {
      column: 'created_at',
    },
    journal_number: {
      column: 'journal_number',
    },
    reference: {
      column: 'reference',
    },
    status: {
      column: 'status',
    },
    amount: {
      column: 'amount',
    },
    description: {
      column: 'description',
    },
    user: {
      column: 'user_id',
      relation: 'users.id',
      relationColumn: 'users.id',
    },
    journal_type: {
      column: 'journal_type',
    },
  }
};
