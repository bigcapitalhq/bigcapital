function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}

function StatusFieldSortQuery(query, role) {
  query.modify('sortByStatus', role.order);
}

export default {
  defaultFilterField: 'name',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'name',
  },
  fields: {
    customer: {
      name: 'credit_note.field.customer',
      column: 'customer_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'customer',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    credit_date: {
      name: 'credit_note.field.credit_note_date',
      column: 'credit_note_date',
      fieldType: 'date',
    },
    credit_number: {
      name: 'credit_note.field.credit_note_number',
      column: 'credit_note_number',
      fieldType: 'text',
    },
    reference_no: {
      name: 'credit_note.field.reference_no',
      column: 'reference_no',
      fieldType: 'text',
    },
    amount: {
      name: 'credit_note.field.amount',
      column: 'amount',
      fieldType: 'number',
    },
    currency_code: {
      name: 'credit_note.field.currency_code',
      column: 'currency_code',
      fieldType: 'number',
    },
    note: {
      name: 'credit_note.field.note',
      column: 'note',
      fieldType: 'text',
    },
    terms_conditions: {
      name: 'credit_note.field.terms_conditions',
      column: 'terms_conditions',
      fieldType: 'text',
    },
    status: {
      name: 'credit_note.field.status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', label: 'credit_note.field.status.draft' },
        { key: 'published', label: 'credit_note.field.status.published' },
        { key: 'open', label: 'credit_note.field.status.open' },
        { key: 'closed', label: 'credit_note.field.status.closed' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    created_at: {
      name: 'credit_note.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};
