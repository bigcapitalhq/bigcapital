export default {
  defaultFilterField: 'receipt_date',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },
  fields: {
    'amount': {
      name: 'Amount',
      column: 'amount',
      fieldType: 'number',
      columnable: true
    },
    'deposit_account': {
      column: 'deposit_account_id',
      name: 'Deposit account',
      columnable: true
    },
    'customer': {
      name: 'Customer',
      column: 'customer_id',
      columnable: true
    },
    'receipt_date': {
      name: 'Receipt date',
      column: 'receipt_date',
      fieldType: 'date',
      columnable: true
    },
    'receipt_number': {
      name: 'Receipt No.',
      column: 'receipt_number',
      fieldType: 'text',
      columnable: true
    },
    'reference_no': {
      name: 'Reference No.',
      column: 'reference_no',
      fieldType: 'text',
      columnable: true
    },
    'receipt_message': {
      name: 'Receipt message',
      column: 'receipt_message',
      fieldType: 'text',
      columnable: true
    },
    'statement': {
      name: 'Statement',
      column: 'statement',
      fieldType: 'text',
      columnable: true
    },
    'created_at': {
      name: 'Created at',
      column: 'created_at',
      fieldType: 'date',
      columnable: true
    },
    'status': {
      name: 'Status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', name: 'Draft' },
        { key: 'closed', name: 'Closed' },
      ],
      query: statusFieldFilterQuery,
      sortQuery: statusFieldSortQuery,
      columnable: true
    },
  },
};

function statusFieldFilterQuery(query, role) {
  switch (role.value) {
    case 'draft':
      query.modify('draft');
      break;
    case 'closed':
      query.modify('closed');
      break;
  }
}

function statusFieldSortQuery(query, role) {
  query.modify('sortByStatus', role.order);
}
