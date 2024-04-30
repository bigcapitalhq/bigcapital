export default {
  defaultFilterField: 'date',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'date',
  },
  columns: {
    date: {
      name: 'inventory_adjustment.field.date',
      column: 'date',
      fieldType: 'date',
      exportable: true,
    },
    type: {
      name: 'inventory_adjustment.field.type',
      column: 'type',
      fieldType: 'enumeration',
      options: [
        { key: 'increment', name: 'inventory_adjustment.field.type.increment' },
        { key: 'decrement', name: 'inventory_adjustment.field.type.decrement' },
      ],
      exportable: true,
    },
    adjustmentAccount: {
      name: 'inventory_adjustment.field.adjustment_account',
      type: 'adjustment_account_id',
      exportable: true,
    },
    reason: {
      name: 'inventory_adjustment.field.reason',
      type: 'text',
      exportable: true,
    },
    referenceNo: {
      name: 'inventory_adjustment.field.reference_no',
      type: 'text',
      exportable: true,
    },
    description: {
      name: 'inventory_adjustment.field.description',
      type: 'text',
      exportable: true,
    },
    publishedAt: {
      name: 'inventory_adjustment.field.published_at',
      type: 'date',
      exportable: true,
    },
    createdAt: {
      name: 'inventory_adjustment.field.created_at',
      type: 'date',
      exportable: true,
    },
  },
  fields: {
    date: {
      name: 'inventory_adjustment.field.date',
      column: 'date',
      fieldType: 'date',
    },
    type: {
      name: 'inventory_adjustment.field.type',
      column: 'type',
      fieldType: 'enumeration',
      options: [
        { key: 'increment', name: 'inventory_adjustment.field.type.increment' },
        { key: 'decrement', name: 'inventory_adjustment.field.type.decrement' },
      ],
    },
    adjustment_account: {
      name: 'inventory_adjustment.field.adjustment_account',
      column: 'adjustment_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'adjustmentAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    reason: {
      name: 'inventory_adjustment.field.reason',
      column: 'reason',
      fieldType: 'text',
    },
    reference_no: {
      name: 'inventory_adjustment.field.reference_no',
      column: 'reference_no',
      fieldType: 'text',
    },
    description: {
      name: 'inventory_adjustment.field.description',
      column: 'description',
      fieldType: 'text',
    },
    published_at: {
      name: 'inventory_adjustment.field.published_at',
      column: 'published_at',
      fieldType: 'date',
    },
    created_at: {
      name: 'inventory_adjustment.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};
