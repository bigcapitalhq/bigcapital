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
      required: true,
    },
    name: {
      name: 'item.field.name',
      column: 'name',
      fieldType: 'text',
      importable: true,
      required: true,
      unique: true,
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
      required: true,
    },
    purchasable: {
      name: 'item.field.purchasable',
      column: 'purchasable',
      fieldType: 'boolean',
      importable: true,
      required: true,
    },
    sellPrice: {
      name: 'item.field.sell_price',
      column: 'sell_price',
      fieldType: 'number',
      importable: true,
      required: true,
    },
    costPrice: {
      name: 'item.field.cost_price',
      column: 'cost_price',
      fieldType: 'number',
      importable: true,
      required: true,
    },
    costAccount: {
      name: 'item.field.cost_account',
      column: 'cost_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'costAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',

      dataTransferObjectKey: 'costAccountId',
      importableRelationLabel: ['name', 'code'],
      importable: true,
      required: true,
    },
    sellAccount: {
      name: 'item.field.sell_account',
      column: 'sell_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'sellAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',

      importableRelationLabel: ['name', 'code'],
      importable: true,

      required: true,
    },
    inventoryAccount: {
      name: 'item.field.inventory_account',
      column: 'inventory_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'inventoryAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',

      importableRelationLabel: ['name', 'code'],
      importable: true,

      required: true,
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
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'category',

      relationEntityLabel: 'name',
      relationEntityKey: 'id',

      importableRelationLabel: 'name',
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
