export default {
  defaultFilterField: 'date',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'name',
  },
  fields: {
    'date': {
      name: 'Date',
      column: 'date',
      fieldType: 'date',
    },
    'journal_number': {
      name: 'Journal number',
      column: 'journal_number',
      fieldType: 'text',
    },
    'reference': {
      name: 'Reference No.',
      column: 'reference',
      fieldType: 'text',
    },
    'journal_type': {
      name: 'Journal type',
      column: 'journal_type',
      fieldType: 'text',
    },
    'amount': {
      name: 'Amount',
      column: 'amount',
      fieldType: 'number',
    },
    'description': {
      name: 'Description',
      column: 'description',
      fieldType: 'text',
    },
    'status': {
      name: 'Status',
      column: 'status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', label: 'Draft' },
        { key: 'published', label: 'published' }
      ],
      sortCustomQuery: StatusFieldSortQuery,
    },
    'created_at': {
      name: 'Created at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};

function StatusFieldSortQuery(query, role) {
  return query.modify('sortByStatus', role.order);
}
