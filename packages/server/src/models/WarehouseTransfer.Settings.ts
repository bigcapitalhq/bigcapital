function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}

export default {
  defaultFilterField: 'name',
  defaultSort: {
    sortField: 'name',
    sortOrder: 'DESC',
  },
  columns: {
    date: {
      name: 'warehouse_transfer.field.date',
      type: 'date',
      exportable: true,
    },
    transaction_number: {
      name: 'warehouse_transfer.field.transaction_number',
      type: 'text',
      exportable: true,
    },
    status: {
      name: 'warehouse_transfer.field.status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', label: 'Draft' },
        { key: 'in-transit', label: 'In Transit' },
        { key: 'transferred', label: 'Transferred' },
      ],
      sortable: false,
    },
    created_at: {
      name: 'warehouse_transfer.field.created_at',
      column: 'created_at',
      columnType: 'date',
      fieldType: 'date',
    },
  },
  fields: {
    date: {
      name: 'warehouse_transfer.field.date',
      column: 'date',
      columnType: 'date',
      fieldType: 'date',
    },
    transaction_number: {
      name: 'warehouse_transfer.field.transaction_number',
      column: 'transaction_number',
      fieldType: 'text',
    },
    status: {
      name: 'warehouse_transfer.field.status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', label: 'Draft' },
        { key: 'in-transit', label: 'In Transit' },
        { key: 'transferred', label: 'Transferred' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortable: false,
    },
    created_at: {
      name: 'warehouse_transfer.field.created_at',
      column: 'created_at',
      columnType: 'date',
      fieldType: 'date',
    },
  },
};
