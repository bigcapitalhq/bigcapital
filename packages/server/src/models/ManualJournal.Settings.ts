export default {
  defaultFilterField: 'date',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'name',
  },
  fields: {
    'date': {
      name: 'manual_journal.field.date',
      column: 'date',
      fieldType: 'date',
    },
    'journal_number': {
      name: 'manual_journal.field.journal_number',
      column: 'journal_number',
      fieldType: 'text',
    },
    'reference': {
      name: 'manual_journal.field.reference',
      column: 'reference',
      fieldType: 'text',
    },
    'journal_type': {
      name: 'manual_journal.field.journal_type',
      column: 'journal_type',
      fieldType: 'text',
    },
    'amount': {
      name: 'manual_journal.field.amount',
      column: 'amount',
      fieldType: 'number',
    },
    'description': {
      name: 'manual_journal.field.description',
      column: 'description',
      fieldType: 'text',
    },
    'status': {
      name: 'manual_journal.field.status',
      column: 'status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', label: 'Draft' },
        { key: 'published', label: 'published' }
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    'created_at': {
      name: 'manual_journal.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};

/**
 * Status field sorting custom query.
 */
function StatusFieldSortQuery(query, role) {
  return query.modify('sortByStatus', role.order);
}

/**
 * Status field filter custom query.
 */
 function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}
