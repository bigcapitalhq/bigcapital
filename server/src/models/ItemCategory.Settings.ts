export default {
  defaultFilterField: 'name',
  defaultSort: {
    sortField: 'name',
    sortOrder: 'DESC',
  },
  fields: {
    name: {
      name: 'Name',
      column: 'name',
      fieldType: 'text',
    },
    description: {
      name: 'Description',
      column: 'description',
      fieldType: 'text',
    },
    count: {
      name: 'Count',
      column: 'count',
      fieldType: 'number',
      virtualColumn: true,
    },
    created_at: {
      name: 'Created at',
      column: 'created_at',
      columnType: 'date',
    },
  },
};
