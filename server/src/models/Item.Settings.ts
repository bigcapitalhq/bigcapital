export default {
  defaultFilterField: 'name',
  defaultSort: {
    sortField: 'name',
    sortOrder: 'DESC',
  },
  fields: {
    'type': {
      name: 'item.field.type',
      column: 'type',
      fieldType: 'enumeration',
      options: [
        { key: 'inventory', label: 'item.field.type.inventory', },
        { key: 'service', label: 'item.field.type.service' },
        { key: 'non-inventory', label: 'item.field.type.non-inventory', },
      ],
    },
    'name': {
      name: 'item.field.name',
      column: 'name',
      fieldType: 'text',
    },
    'code': {
      name: 'item.field.code',
      column: 'code',
      fieldType: 'text',
    },
    'sellable': {
      name: 'item.field.sellable',
      column: 'sellable',
      fieldType: 'boolean',
    },
    'purchasable': {
      name: 'item.field.purchasable',
      column: 'purchasable',
      fieldType: 'boolean',
    },
    'sell_price': {
      name: 'item.field.cost_price',
      column: 'sell_price',
      fieldType: 'number',
    },
    'cost_price': {
      name: 'item.field.cost_account',
      column: 'cost_price',
      fieldType: 'number',
    },
    'cost_account': {
      name: 'item.field.sell_account',
      column: 'cost_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'costAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    'sell_account': {
      name: 'item.field.sell_description',
      column: 'sell_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'sellAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    'inventory_account': {
      name: 'item.field.inventory_account',
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
      name: 'item.field.quantity_on_hand',
      column: 'quantity_on_hand',
      fieldType: 'number',
    },
    'note': {
      name: 'item.field.note',
      column: 'note',
      fieldType: 'text',
    },
    'category': {
      name: 'item.field.category',
      column: 'category_id',

      relationType: 'enumeration',
      relationKey: 'category',

      relationEntityLabel: 'name',
      relationEntityKey: 'id',
    },
    'active': {
      name: 'item.field.active',
      column: 'active',
      fieldType: 'boolean',
      filterable: false,
    },
    'created_at': {
      name: 'item.field.created_at',
      column: 'created_at',
      columnType: 'date',
      fieldType: 'date',
    },
  },
};
