export default {
  defaultFilterField: 'name',
  defaultSort: {
    sortField: 'name',
    sortOrder: 'DESC',
  },
  importable: true,
  fields: {
    name: {
      name: 'item_category.field.name',
      column: 'name',
      fieldType: 'text',
      importable: true,
    },
    description: {
      name: 'item_category.field.description',
      column: 'description',
      fieldType: 'text',
      importable: true,
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
};
