export default {
  defaultFilterField: 'name',
  defaultSort: {
    sortField: 'name',
    sortOrder: 'DESC',
  },
  fields: {
    name: {
      label: 'Name',
      column: 'name',
      fieldType: 'text',
    },
    description: {
      label: 'Description',
      column: 'description',
      fieldType: 'text',
    },
    cost_account: {
      label: 'Cost account',
      column: 'cost_account_id',
    },
    sell_account: {
      label: 'Sell account',
      column: 'sell_account_id',
    },
    inventory_account: {
      label: 'Inventory account',
      column: 'inventory_account_id',
    },
    count: {
      label: 'Count',
      column: 'count',
      sortQuery: this.sortCountQuery,
    },
    created_at: {
      label: 'Created at',
      column: 'created_at',
      columnType: 'date',
    },
  },
};
