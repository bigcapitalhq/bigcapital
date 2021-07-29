export default {
  defaultFilterField: 'name',
  defaultSort: {
    sortField: 'name',
    sortOrder: 'DESC',
  },
  fields: {
    'type': {
      name: 'Item type',
      column: 'type',
      columnable: true,
      fieldType: 'enumeration',
      options: [
        { key: 'inventory', label: 'Inventory', },
        { key: 'service', label: 'Service' },
        { key: 'non-inventory', label: 'Non Inventory', },
      ],
    },
    'name': {
      name: 'Name',
      column: 'name',
      columnable: true,
      fieldType: 'text',
    },
    'code': {
      name: 'Code',
      column: 'code',
      columnable: true,
      fieldType: 'text',
    },
    'sellable': {
      name: 'Sellable',
      column: 'sellable',
      fieldType: 'boolean',
    },
    'purchasable': {
      name: 'Purchasable',
      column: 'purchasable',
      fieldType: 'boolean',
    },
    'sell_price': {
      name: 'Sell price',
      column: 'sell_price',
      fieldType: 'number',
    },
    'cost_price': {
      name: 'Cost price',
      column: 'cost_price',
      fieldType: 'number',
    },
    'cost_account': {
      name: 'Cost account',
      column: 'cost_account_id',
      columnable: true,
    },
    'sell_account': {
      name: 'Sell account',
      column: 'sell_account_id',
    },
    'inventory_account': {
      name: 'Inventory account',
      column: 'inventory_account_id',
    },
    'sell_description': {
      name: 'Sell description',
      column: 'sell_description',
      fieldType: 'text',
    },
    'purchase_description': {
      name: 'Purchase description',
      column: 'purchase_description',
      fieldType: 'text',
    },
    'quantity_on_hand': {
      name: 'Quantity on hand',
      column: 'quantity_on_hand',
      fieldType: 'number',
    },
    'note': {
      name: 'Note',
      column: 'note',
      fieldType: 'text',
      columnable: true,
    },
    'category': {
      name: 'Category',
      column: 'category_id',
      columnable: true,
    },
    'active': {
      name: 'Active',
      column: 'active',
      fieldType: 'boolean',
    },
    'created_at': {
      name: 'Created at',
      column: 'created_at',
      columnType: 'date',
      fieldType: 'date',
    },
  },
};
