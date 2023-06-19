export const ERRORS = {
  WAREHOUSE_TRANSFER_NOT_FOUND: 'WAREHOUSE_TRANSFER_NOT_FOUND',
  WAREHOUSES_TRANSFER_SHOULD_NOT_BE_SAME:
    'WAREHOUSES_TRANSFER_SHOULD_NOT_BE_SAME',

  FROM_WAREHOUSE_NOT_FOUND: 'FROM_WAREHOUSE_NOT_FOUND',
  TO_WAREHOUSE_NOT_FOUND: 'TO_WAREHOUSE_NOT_FOUND',
  WAREHOUSE_TRANSFER_ITEMS_SHOULD_BE_INVENTORY:
    'WAREHOUSE_TRANSFER_ITEMS_SHOULD_BE_INVENTORY',

  WAREHOUSE_TRANSFER_ALREADY_TRANSFERRED:
    'WAREHOUSE_TRANSFER_ALREADY_TRANSFERRED',

  WAREHOUSE_TRANSFER_ALREADY_INITIATED: 'WAREHOUSE_TRANSFER_ALREADY_INITIATED',
  WAREHOUSE_TRANSFER_NOT_INITIATED: 'WAREHOUSE_TRANSFER_NOT_INITIATED',
};

// Warehouse transfers default views.
export const DEFAULT_VIEWS = [
  {
    name: 'warehouse_transfer.view.draft.name',
    slug: 'draft',
    rolesLogicExpression: '1',
    roles: [
      { index: 1, fieldKey: 'status', comparator: 'equals', value: 'draft' },
    ],
    columns: [],
  },
  {
    name: 'warehouse_transfer.view.in_transit.name',
    slug: 'in-transit',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'status',
        comparator: 'equals',
        value: 'in-transit',
      },
    ],
    columns: [],
  },
  {
    name: 'warehouse_transfer.view.transferred.name',
    slug: 'transferred',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'status',
        comparator: 'equals',
        value: 'transferred',
      },
    ],
    columns: [],
  },
];
