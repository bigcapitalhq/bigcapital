export default {
  defaultFilterField: 'estimate_date',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'estimate_date',
  },
  fields: {
    'amount': {
      name: 'Amount',
      column: 'amount',
      fieldType: 'number',
    },
    'estimate_number': {
      name: 'Estimate number',
      column: 'estimate_number',
      fieldType: 'text',
    },
    'customer': {
      name: 'Customer',
      column: 'customer_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'customer',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    'estimate_date': {
      name: 'Estimate date',
      column: 'estimate_date',
      fieldType: 'date',
    },
    'expiration_date': {
      name: 'Expiration date',
      column: 'expiration_date',
      fieldType: 'date',
    },
    'reference_no': {
      name: 'Reference No.',
      column: 'reference',
      fieldType: 'text',
    },
    'note': {
      name: 'Note',
      column: 'note',
      fieldType: 'text',
    },
    'terms_conditions': {
      name: 'Terms & conditions',
      column: 'terms_conditions',
      fieldType: 'text',
    },
    'status': {
      name: 'Status',
      fieldType: 'enumeration',
      options: [
        { label: 'Delivered', key: 'delivered' },
        { label: 'Rejected', key: 'rejected' },
        { label: 'Approved', key: 'approved' },
        { label: 'Delivered', key: 'delivered' },
        { label: 'Draft', key: 'draft' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    'created_at': {
      name: 'Created at',
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
