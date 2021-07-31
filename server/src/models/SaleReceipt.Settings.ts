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
    },
    'deposit_account': {
      column: 'deposit_account_id',
      name: 'Deposit account',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'depositAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
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
    'receipt_date': {
      name: 'Receipt date',
      column: 'receipt_date',
      fieldType: 'date',
      
    },
    'receipt_number': {
      name: 'Receipt No.',
      column: 'receipt_number',
      fieldType: 'text',
    },
    'reference_no': {
      name: 'Reference No.',
      column: 'reference_no',
      fieldType: 'text',
    },
    'receipt_message': {
      name: 'Receipt message',
      column: 'receipt_message',
      fieldType: 'text',
    },
    'statement': {
      name: 'Statement',
      column: 'statement',
      fieldType: 'text',
    },
    'created_at': {
      name: 'Created at',
      column: 'created_at',
      fieldType: 'date',
    },
    'status': {
      name: 'Status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', name: 'Draft' },
        { key: 'closed', name: 'Closed' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
  },
};

function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}

function StatusFieldSortQuery(query, role) {
  query.modify('sortByStatus', role.order);
}
