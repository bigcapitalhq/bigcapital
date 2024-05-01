export default {
  defaultFilterField: 'name',
  defaultSort: {
    sortField: 'name',
    sortOrder: 'DESC',
  },
  importable: true,
  exportable: true,
  fields: {
    name: {
      name: 'item_category.field.name',
      column: 'name',
      fieldType: 'text',
    },
    description: {
      name: 'item_category.field.description',
      column: 'description',
      fieldType: 'text',
    },
    count: {
      name: 'item_category.field.count',
      column: 'count',
      fieldType: 'number',
      virtualColumn: true,
    },
    created_at: {
      name: 'item_category.field.created_at',
      column: 'created_at',
      columnType: 'date',
    },
  },
  columns: {
    name: {
      name: 'item_category.field.name',
      type: 'text',
      exportable: true,
    },
    description: {
      name: 'item_category.field.description',
      type: 'text',
      exportable: true,
    },
    count: {
      name: 'item_category.field.count',
      type: 'text',
      exportable: true,
    },
    createdAt: {
      name: 'item_category.field.created_at',
      type: 'text',
      exportable: true,
    },
  },
  fields2: {
    name: {
      name: 'item_category.field.name',
      column: 'name',
      fieldType: 'text',
    },
    description: {
      name: 'item_category.field.description',
      column: 'description',
      fieldType: 'text',
    },
  },
};
