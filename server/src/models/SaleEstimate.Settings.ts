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
      filterQuery: statusFieldFilterQuery,
      sortQuery: statusFieldSortQuery,
    },
    'created_at': {
      name: 'Created at',
      column: 'created_at',
      columnType: 'date',
    },
  },
};

function statusFieldSortQuery(query, role) {
  return query.modify('orderByDraft', role.order);
}

function statusFieldFilterQuery(query, role) {
  switch (role.value) {
    case 'draft':
      query.modify('draft');
      break;
    case 'delivered':
      query.modify('delivered');
      break;
    case 'approved':
      query.modify('approved');
      break;
    case 'rejected':
      query.modify('rejected');
      break;
    case 'invoiced':
      query.modify('invoiced');
      break;
    case 'expired':
      query.modify('expired');
      break;
  }
}
