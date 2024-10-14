export default {
  importable: true,
  exportable: true,
  defaultFilterField: 'name',
  defaultSort: {
    sortField: 'name',
    sortOrder: 'DESC',
  },
  print: {
    pageTitle: 'Items',
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
    },
    name: {
      name: 'item.field.name',
      column: 'name',
      fieldType: 'text',
    },
    code: {
      name: 'item.field.code',
      column: 'code',
      fieldType: 'text',
    },
    sellable: {
      name: 'item.field.sellable',
      column: 'sellable',
      fieldType: 'boolean',
    },
    purchasable: {
      name: 'item.field.purchasable',
      column: 'purchasable',
      fieldType: 'boolean',
    },
    sell_price: {
      name: 'item.field.sell_price',
      column: 'sell_price',
      fieldType: 'number',
    },
    cost_price: {
      name: 'item.field.cost_price',
      column: 'cost_price',
      fieldType: 'number',
    },
    cost_account: {
      name: 'item.field.cost_account',
      column: 'cost_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'costAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    sell_account: {
      name: 'item.field.sell_account',
      column: 'sell_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'sellAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    inventory_account: {
      name: 'item.field.inventory_account',
      column: 'inventory_account_id',

      relationType: 'enumeration',
      relationKey: 'inventoryAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    sell_description: {
      name: 'Sell description',
      column: 'sell_description',
      fieldType: 'text',
    },
    purchase_description: {
      name: 'Purchase description',
      column: 'purchase_description',
      fieldType: 'text',
    },
    quantity_on_hand: {
      name: 'item.field.quantity_on_hand',
      column: 'quantity_on_hand',
      fieldType: 'number',
    },
    note: {
      name: 'item.field.note',
      column: 'note',
      fieldType: 'text',
    },
    category: {
      name: 'item.field.category',
      column: 'category_id',

      relationType: 'enumeration',
      relationKey: 'category',

      relationEntityLabel: 'name',
      relationEntityKey: 'id',
    },
    active: {
      name: 'item.field.active',
      column: 'active',
      fieldType: 'boolean',
      filterable: false,
    },
    created_at: {
      name: 'item.field.created_at',
      column: 'created_at',
      columnType: 'date',
      fieldType: 'date',
    },
  },
  columns: {
    type: {
      name: 'item.field.type',
      type: 'text',
      exportable: true,
      accessor: 'typeFormatted',
    },
    name: {
      name: 'item.field.name',
      type: 'text',
      exportable: true,
    },
    code: {
      name: 'item.field.code',
      type: 'text',
      exportable: true,
    },
    sellable: {
      name: 'item.field.sellable',
      type: 'boolean',
      exportable: true,
      printable: false,
    },
    purchasable: {
      name: 'item.field.purchasable',
      type: 'boolean',
      exportable: true,
      printable: false,
    },
    sellPrice: {
      name: 'item.field.sell_price',
      type: 'number',
      exportable: true,
    },
    costPrice: {
      name: 'item.field.cost_price',
      type: 'number',
      exportable: true,
    },
    costAccount: {
      name: 'item.field.cost_account',
      type: 'text',
      accessor: 'costAccount.name',
      exportable: true,
      printable: false,
    },
    sellAccount: {
      name: 'item.field.sell_account',
      type: 'text',
      accessor: 'sellAccount.name',
      exportable: true,
      printable: false,
    },
    inventoryAccount: {
      name: 'item.field.inventory_account',
      type: 'text',
      accessor: 'inventoryAccount.name',
      exportable: true,
    },
    sellDescription: {
      name: 'Sell description',
      type: 'text',
      exportable: true,
      printable: false,
    },
    purchaseDescription: {
      name: 'Purchase description',
      type: 'text',
      exportable: true,
      printable: false,
    },
    quantityOnHand: {
      name: 'item.field.quantity_on_hand',
      type: 'number',
      exportable: true,
    },
    note: {
      name: 'item.field.note',
      type: 'text',
      exportable: true,
    },
    category: {
      name: 'item.field.category',
      type: 'text',
      accessor: 'category.name',
      exportable: true,
    },
    active: {
      name: 'item.field.active',
      fieldType: 'boolean',
      exportable: true,
      printable: false,
    },
    createdAt: {
      name: 'item.field.created_at',
      type: 'date',
      exportable: true,
      printable: false,
    },
  },
  fields2: {
    type: {
      name: 'item.field.type',
      fieldType: 'enumeration',
      options: [
        { key: 'inventory', label: 'item.field.type.inventory' },
        { key: 'service', label: 'item.field.type.service' },
        { key: 'non-inventory', label: 'item.field.type.non-inventory' },
      ],
      required: true,
    },
    name: {
      name: 'item.field.name',
      fieldType: 'text',
      required: true,
    },
    code: {
      name: 'item.field.code',
      fieldType: 'text',
    },
    sellable: {
      name: 'item.field.sellable',
      fieldType: 'boolean',
    },
    purchasable: {
      name: 'item.field.purchasable',
      fieldType: 'boolean',
    },
    sellPrice: {
      name: 'item.field.sell_price',
      fieldType: 'number',
    },
    costPrice: {
      name: 'item.field.cost_price',
      fieldType: 'number',
    },
    costAccountId: {
      name: 'item.field.cost_account',
      fieldType: 'relation',
      relationModel: 'Account',
      relationImportMatch: ['name', 'code'],
      importHint: 'Matches the account name or code.',
    },
    sellAccountId: {
      name: 'item.field.sell_account',
      fieldType: 'relation',
      relationModel: 'Account',
      relationImportMatch: ['name', 'code'],
      importHint: 'Matches the account name or code.',
    },
    inventoryAccountId: {
      name: 'item.field.inventory_account',
      fieldType: 'relation',
      relationModel: 'Account',
      relationImportMatch: ['name', 'code'],
      importHint: 'Matches the account name or code.',
    },
    sellDescription: {
      name: 'Sell Description',
      fieldType: 'text',
    },
    purchaseDescription: {
      name: 'Purchase Description',
      fieldType: 'text',
    },
    note: {
      name: 'item.field.note',
      fieldType: 'text',
    },
    categoryId: {
      name: 'item.field.category',
      fieldType: 'relation',
      relationModel: 'ItemCategory',
      relationImportMatch: ['name'],
      importHint: 'Matches the category name.',
    },
    active: {
      name: 'item.field.active',
      fieldType: 'boolean',
    },
  },
};
