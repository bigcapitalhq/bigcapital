/* eslint-disable quote-props */

export default {
  // Expenses.
  expense: {
    payment_date: {
      column: 'payment_date',
    },
    payment_account: {
      column: 'payment_account_id',
      relation: 'accounts.id',
    },
    amount: {
      column: 'total_amount',
    },
    currency_code: {
      column: 'currency_code',
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
  Account: {
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
  item: {
    type: {
      column: 'type',
    },
    name: {
      column: 'name',
    },
    sellable: {
      column: 'sellable',
    },
    purchasable: {
      column: 'purchasable',
    },
    sell_price: {
      column: 'sell_price'
    },
    cost_price: {
      column: 'cost_price',
    },
    currency_code: {
      column: 'currency_code',
    },
    cost_account: {
      column: 'cost_account_id',
      relation: 'accounts.id',
    },
    sell_account: {
      column: 'sell_account_id',
      relation: 'accounts.id',
    },
    inventory_account: {
      column: 'inventory_account_id',
      relation: 'accounts.id',
    },
    sell_description: {
      column: 'sell_description',
    },
    purchase_description: {
      column: 'purchase_description',
    },
    quantity_on_hand: {
      column: 'quantity_on_hand',
    },
    note: {
      column: 'note',
    },
    category: {
      column: 'category_id',
      relation: 'categories.id',
    },
    user: {
      column: 'user_id',
      relation: 'users.id',
      relationColumn: 'users.id',
    },
    created_at: {
      column: 'created_at',
    }
  },

  // Item category.
  item_category: {
    name: {
      column: 'name',
    },
    description: {
      column: 'description',
    },
    parent_category_id: {
      column: 'parent_category_id',
      relation: 'items_categories.id',
      relationColumn: 'items_categories.id',
    },
    user: {
      column: 'user_id',
      relation: 'users.id',
      relationColumn: 'users.id',
    },
    cost_account: {
      column: 'cost_account_id',
      relation: 'accounts.id',
    },
    sell_account: {
      column: 'sell_account_id',
      relation: 'accounts.id',
    },
    inventory_account: {
      column: 'inventory_account_id',
      relation: 'accounts.id',
    },
    cost_method: {
      column: 'cost_method',
    },
  },

  // Manual Journals
  manual_journal: {
    date: {
      column: 'date',
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
    created_at: {
      column: 'created_at',
    },
  }
};
