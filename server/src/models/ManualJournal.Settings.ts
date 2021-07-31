export default {
  defaultFilterField: 'date',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'name',
  },
  fields: {
    'date': {
      label: 'Date',
      column: 'date',
      fieldType: 'date',
    },
    'journal_number': {
      label: 'Journal number',
      column: 'journal_number',
      fieldType: 'text',
    },
    'reference': {
      label: 'Reference No.',
      column: 'reference',
      fieldType: 'text',
    },
    'journal_type': {
      label: 'Journal type',
      column: 'journal_type',
      fieldType: 'text',
    },
    'amount': {
      label: 'Amount',
      column: 'amount',
      columnType: 'number',
    },
    'description': {
      label: 'Description',
      column: 'description',
      fieldType: 'text',
    },
    'status': {
      label: 'Status',
      column: 'status',
      fieldType: 'enumeration',
      sortCustomQuery: StatusFieldSortQuery,
    },
    'created_at': {
      label: 'Created at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};

function StatusFieldSortQuery(query, role) {
  return query.modify('sortByStatus', role.order);
}
