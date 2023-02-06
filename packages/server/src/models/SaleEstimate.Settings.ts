export default {
  defaultFilterField: 'estimate_date',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'estimate_date',
  },
  fields: {
    'amount': {
      name: 'estimate.field.amount',
      column: 'amount',
      fieldType: 'number',
    },
    'estimate_number': {
      name: 'estimate.field.estimate_number',
      column: 'estimate_number',
      fieldType: 'text',
    },
    'customer': {
      name: 'estimate.field.customer',
      column: 'customer_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'customer',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    'estimate_date': {
      name: 'estimate.field.estimate_date',
      column: 'estimate_date',
      fieldType: 'date',
    },
    'expiration_date': {
      name: 'estimate.field.expiration_date',
      column: 'expiration_date',
      fieldType: 'date',
    },
    'reference_no': {
      name: 'estimate.field.reference_no',
      column: 'reference',
      fieldType: 'text',
    },
    'note': {
      name: 'estimate.field.note',
      column: 'note',
      fieldType: 'text',
    },
    'terms_conditions': {
      name: 'estimate.field.terms_conditions',
      column: 'terms_conditions',
      fieldType: 'text',
    },
    'status': {
      name: 'estimate.field.status',
      fieldType: 'enumeration',
      options: [
        { label: 'estimate.field.status.delivered', key: 'delivered' },
        { label: 'estimate.field.status.rejected', key: 'rejected' },
        { label: 'estimate.field.status.approved', key: 'approved' },
        { label: 'estimate.field.status.draft', key: 'draft' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    'created_at': {
      name: 'estimate.field.created_at',
      column: 'created_at',
      columnType: 'date',
    },
  },
};

function StatusFieldSortQuery(query, role) {
  query.modify('orderByStatus', role.order);
}

function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}
