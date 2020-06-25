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
      relationColumn: 'account_types.id',
    },
    'description': {
      column: 'description',
    },
    'code': {
      column: 'code',
    },
    'root_type': {
      column: 'account_type_id',
      relation: 'account_types.id',
      relationColumn: 'account_types.root_type',
    },
    'created_at': {
      column: 'created_at',
      columnType: 'date',
    },
    active: {
      column: 'active',
      
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
  'manual_journals': {
    'type': {
      column: 'transaction_type',
    },
    'status': {
      column: 'status',
    },
    'date': {
      column: 'date',
    },
    'journal_number': {
      column: 'journal_number',
    },
    'amount': {
      column: 'amount',
    },
    'created_at': {
      column: 'created_at',
    },
  }
};
