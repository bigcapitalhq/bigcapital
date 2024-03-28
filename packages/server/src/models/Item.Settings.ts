export default {
  importable: true,
  defaultFilterField: 'name',
  defaultSort: {
    sortField: 'name',
    sortOrder: 'DESC',
  },
  fields: {
    type: {
      name: 'item.field.type',
      column: 'type',
      fieldType: 'enumeration',
      options: [
        { key: 'inventory', label: 'item.field.type.inventory' },
        { key: 'service', label: 'item.field.type.service' },
        { key: 'non-inventory', label: 'item.field.type.non-inventory' },
      ],
      importable: true,
    },
    name: {
      name: 'item.field.name',
      column: 'name',
      fieldType: 'text',
      importable: true,
    },
    code: {
      name: 'item.field.code',
      column: 'code',
      fieldType: 'text',
      importable: true,
    },
    sellable: {
      name: 'item.field.sellable',
      column: 'sellable',
      fieldType: 'boolean',
      importable: true,
    },
    purchasable: {
      name: 'item.field.purchasable',
      column: 'purchasable',
      fieldType: 'boolean',
      importable: true,
    },
    sellPrice: {
      name: 'item.field.cost_price',
      column: 'sell_price',
      fieldType: 'number',
      importable: true,
    },
    costPrice: {
      name: 'item.field.cost_account',
      column: 'cost_price',
      fieldType: 'number',
      importable: true,
    },
    costAccount: {
      name: 'item.field.sell_account',
      column: 'cost_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'costAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',

      importable: true,
    },
    sellAccount: {
      name: 'item.field.sell_description',
      column: 'sell_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'sellAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',

      importable: true,
    },
    inventoryAccount: {
      name: 'item.field.inventory_account',
      column: 'inventory_account_id',

      relationType: 'enumeration',
      relationKey: 'inventoryAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',

      importable: true,
    },
    sellDescription: {
      name: 'Sell description',
      column: 'sell_description',
      fieldType: 'text',
      importable: true,
    },
    purchaseDescription: {
      name: 'Purchase description',
      column: 'purchase_description',
      fieldType: 'text',
      importable: true,
    },
    quantityOnHand: {
      name: 'item.field.quantity_on_hand',
      column: 'quantity_on_hand',
      fieldType: 'number',
      importable: true,
    },
    note: {
      name: 'item.field.note',
      column: 'note',
      fieldType: 'text',
      importable: true,
    },
    category: {
      name: 'item.field.category',
      column: 'category_id',

      relationType: 'enumeration',
      relationKey: 'category',

      relationEntityLabel: 'name',
      relationEntityKey: 'id',
      importable: true,
    },
    active: {
      name: 'item.field.active',
      column: 'active',
      fieldType: 'boolean',
      importable: true,
    },
    createdAt: {
      name: 'item.field.created_at',
      column: 'created_at',
      columnType: 'date',
      fieldType: 'date',
    },
  },
};
