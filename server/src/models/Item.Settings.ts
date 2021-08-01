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
      fieldType: 'text',
    },
    'code': {
      name: 'Code',
      column: 'code',
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
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'costAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    'sell_account': {
      name: 'Sell account',
      column: 'sell_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'sellAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    'inventory_account': {
      name: 'Inventory account',
      column: 'inventory_account_id',

      relationType: 'enumeration',
      relationKey: 'inventoryAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
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
    },
    'category': {
      name: 'Category',
      column: 'category_id',

      relationType: 'enumeration',
      relationKey: 'category',

      relationEntityLabel: 'name',
      relationEntityKey: 'id',
    },
    'active': {
      name: 'Active',
      column: 'active',
      fieldType: 'boolean',
      filterable: false,
    },
    'created_at': {
      name: 'Created at',
      column: 'created_at',
      columnType: 'date',
      fieldType: 'date',
    },
  },
};
