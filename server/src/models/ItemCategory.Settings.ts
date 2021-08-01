export default {
  defaultFilterField: 'name',
  defaultSort: {
    sortField: 'name',
    sortOrder: 'DESC',
  },
  fields: {
    name: {
      label: 'Name',
      column: 'name',
      fieldType: 'text',
    },
    description: {
      label: 'Description',
      column: 'description',
      fieldType: 'text',
    },
    count: {
      label: 'Count',
      column: 'count',
      fieldType: 'number',
      virtualColumn: true,
    },
    created_at: {
      label: 'Created at',
      column: 'created_at',
      columnType: 'date',
    },
  },
};
