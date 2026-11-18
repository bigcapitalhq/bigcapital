/**
 * Units of measure an item can be measured in.
 * Keep in sync with the webapp `ITEM_UNITS` constant.
 */
export const ITEM_UNITS = [
  'piece',
  'dozen',
  'pair',
  'set',
  'pack',
  'box',
  'kg',
  'g',
  'lb',
  'oz',
  'l',
  'ml',
  'm',
  'cm',
  'm2',
  'm3',
  'hour',
  'day',
] as const;

export const DEFAULT_ITEM_UNIT = 'piece';

export type ItemUnit = (typeof ITEM_UNITS)[number];

/**
 * Item image constraints.
 */
export const MAX_ITEM_IMAGES = 15;
export const MAX_ITEM_IMAGE_SIZE = 5 * 1024 * 1024;
export const ITEM_IMAGE_TYPES = ['front', 'rear', 'other'] as const;

export type ItemImageRole = (typeof ITEM_IMAGE_TYPES)[number];

/** Thumbnail size generated for item images (longest edge). */
export const ITEM_IMAGE_THUMBNAIL_SIZE = 512;
/** JPEG quality of the generated item image thumbnail. */
export const ITEM_IMAGE_THUMBNAIL_QUALITY = 82;

export const ERRORS = {
  NOT_FOUND: 'NOT_FOUND',
  ITEMS_NOT_FOUND: 'ITEMS_NOT_FOUND',

  ITEM_NAME_EXISTS: 'ITEM_NAME_EXISTS',
  ITEM_CATEOGRY_NOT_FOUND: 'ITEM_CATEOGRY_NOT_FOUND',
  COST_ACCOUNT_NOT_COGS: 'COST_ACCOUNT_NOT_COGS',
  COST_ACCOUNT_NOT_FOUMD: 'COST_ACCOUNT_NOT_FOUMD',
  SELL_ACCOUNT_NOT_FOUND: 'SELL_ACCOUNT_NOT_FOUND',
  SELL_ACCOUNT_NOT_INCOME: 'SELL_ACCOUNT_NOT_INCOME',

  INVENTORY_ACCOUNT_NOT_FOUND: 'INVENTORY_ACCOUNT_NOT_FOUND',
  INVENTORY_ACCOUNT_NOT_INVENTORY: 'INVENTORY_ACCOUNT_NOT_INVENTORY',

  ITEMS_HAVE_ASSOCIATED_TRANSACTIONS: 'ITEMS_HAVE_ASSOCIATED_TRANSACTIONS',
  ITEM_HAS_ASSOCIATED_TRANSACTINS: 'ITEM_HAS_ASSOCIATED_TRANSACTINS',

  ITEM_HAS_ASSOCIATED_INVENTORY_ADJUSTMENT:
    'ITEM_HAS_ASSOCIATED_INVENTORY_ADJUSTMENT',
  ITEM_CANNOT_CHANGE_INVENTORY_TYPE: 'ITEM_CANNOT_CHANGE_INVENTORY_TYPE',
  TYPE_CANNOT_CHANGE_WITH_ITEM_HAS_TRANSACTIONS:
    'TYPE_CANNOT_CHANGE_WITH_ITEM_HAS_TRANSACTIONS',
  INVENTORY_ACCOUNT_CANNOT_MODIFIED: 'INVENTORY_ACCOUNT_CANNOT_MODIFIED',

  ITEM_HAS_ASSOCIATED_TRANSACTIONS: 'ITEM_HAS_ASSOCIATED_TRANSACTIONS',

  PURCHASE_TAX_RATE_NOT_FOUND: 'PURCHASE_TAX_RATE_NOT_FOUND',
  SELL_TAX_RATE_NOT_FOUND: 'SELL_TAX_RATE_NOT_FOUND',

  INCOME_ACCOUNT_REQUIRED_WITH_SELLABLE_ITEM:
    'INCOME_ACCOUNT_REQUIRED_WITH_SELLABLE_ITEM',
  COST_ACCOUNT_REQUIRED_WITH_PURCHASABLE_ITEM:
    'COST_ACCOUNT_REQUIRED_WITH_PURCHASABLE_ITEM',

  ITEM_IMAGE_NOT_FOUND: 'ITEM_IMAGE_NOT_FOUND',
  ITEM_IMAGES_LIMIT_EXCEEDED: 'ITEM_IMAGES_LIMIT_EXCEEDED',
  ITEM_IMAGE_INVALID_FORMAT: 'ITEM_IMAGE_INVALID_FORMAT',
  ITEM_IMAGE_INVALID_TYPE: 'ITEM_IMAGE_INVALID_TYPE',
  ITEM_IMAGE_UPLOAD_FAILED: 'ITEM_IMAGE_UPLOAD_FAILED',
};

export const DEFAULT_VIEW_COLUMNS = [];
export const ItemDefaultViews = [
  {
    name: 'Services',
    slug: 'services',
    rolesLogicExpression: '1',
    roles: [
      { index: 1, fieldKey: 'type', comparator: 'equals', value: 'service' },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'Inventory',
    slug: 'inventory',
    rolesLogicExpression: '1',
    roles: [
      { index: 1, fieldKey: 'type', comparator: 'equals', value: 'inventory' },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'Non Inventory',
    slug: 'non-inventory',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'type',
        comparator: 'equals',
        value: 'non-inventory',
      },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
];

export const ItemsSampleData = [
  {
    'Item Type': 'Inventory',
    'Item Name': 'Hettinger, Schumm and Bartoletti',
    'Item Code': '1000',
    'Reorder Point': '10',
    Sellable: 'T',
    Purchasable: 'T',
    'Cost Price': '10000',
    'Sell Price': '1000',
    'Cost Account': 'Cost of Goods Sold',
    'Sell Account': 'Other Income',
    'Inventory Account': 'Inventory Asset',
    'Sell Description': 'Description ....',
    'Purchase Description': 'Description ....',
    Category: 'sdafasdfsadf',
    Note: 'At dolor est non tempore et quisquam.',
    Active: 'TRUE',
  },
  {
    'Item Type': 'Inventory',
    'Item Name': 'Schmitt Group',
    'Item Code': '1001',
    'Reorder Point': '10',
    Sellable: 'T',
    Purchasable: 'T',
    'Cost Price': '10000',
    'Sell Price': '1000',
    'Cost Account': 'Cost of Goods Sold',
    'Sell Account': 'Other Income',
    'Inventory Account': 'Inventory Asset',
    'Sell Description': 'Description ....',
    'Purchase Description': 'Description ....',
    Category: 'sdafasdfsadf',
    Note: 'Id perspiciatis at adipisci minus accusamus dolor iure dolore.',
    Active: 'TRUE',
  },
  {
    'Item Type': 'Inventory',
    'Item Name': 'Marks - Carroll',
    'Item Code': '1002',
    'Reorder Point': '10',
    Sellable: 'T',
    Purchasable: 'T',
    'Cost Price': '10000',
    'Sell Price': '1000',
    'Cost Account': 'Cost of Goods Sold',
    'Sell Account': 'Other Income',
    'Inventory Account': 'Inventory Asset',
    'Sell Description': 'Description ....',
    'Purchase Description': 'Description ....',
    Category: 'sdafasdfsadf',
    Note: 'Odio odio minus similique.',
    Active: 'TRUE',
  },
  {
    'Item Type': 'Inventory',
    'Item Name': 'VonRueden, Ruecker and Hettinger',
    'Item Code': '1003',
    'Reorder Point': '10',
    Sellable: 'T',
    Purchasable: 'T',
    'Cost Price': '10000',
    'Sell Price': '1000',
    'Cost Account': 'Cost of Goods Sold',
    'Sell Account': 'Other Income',
    'Inventory Account': 'Inventory Asset',
    'Sell Description': 'Description ....',
    'Purchase Description': 'Description ....',
    Category: 'sdafasdfsadf',
    Note: 'Quibusdam dolores illo.',
    Active: 'TRUE',
  },
];
