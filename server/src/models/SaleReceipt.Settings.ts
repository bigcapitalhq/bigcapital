export default {
  defaultFilterField: 'receipt_date',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },
  fields: {
    'amount': {
      name: 'receipt.field.amount',
      column: 'amount',
      fieldType: 'number',
    },
    'deposit_account': {
      column: 'deposit_account_id',
      name: 'receipt.field.deposit_account',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'depositAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    'customer': {
      name: 'receipt.field.customer',
      column: 'customer_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'customer',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    'receipt_date': {
      name: 'receipt.field.receipt_date',
      column: 'receipt_date',
      fieldType: 'date',
      
    },
    'receipt_number': {
      name: 'receipt.field.receipt_number',
      column: 'receipt_number',
      fieldType: 'text',
    },
    'reference_no': {
      name: 'receipt.field.reference_no',
      column: 'reference_no',
      fieldType: 'text',
    },
    'receipt_message': {
      name: 'receipt.field.receipt_message',
      column: 'receipt_message',
      fieldType: 'text',
    },
    'statement': {
      name: 'receipt.field.statement',
      column: 'statement',
      fieldType: 'text',
    },
    'created_at': {
      name: 'receipt.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
    'status': {
      name: 'receipt.field.status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', label: 'receipt.field.status.draft' },
        { key: 'closed', label: 'receipt.field.status.closed' },
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
