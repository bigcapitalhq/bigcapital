/**
 * Expense - Settings.
 */
export default {
  defaultFilterField: 'description',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'name',
  },
  fields: {
    'payment_date': {
      name: 'Payment date',
      column: 'payment_date',
      fieldType: 'date',
    },
    'payment_account': {
      name: 'Payment account',
      column: 'payment_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'paymentAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    'amount': {
      name: 'Amount',
      column: 'total_amount',
      fieldType: 'number',
    },
    'reference_no': {
      name: 'Reference No.',
      column: 'reference_no',
      fieldType: 'text',
    },
    'description': {
      name: 'Description',
      column: 'description',
      fieldType: 'text',
    },
    'published': {
      name: 'Published',
      column: 'published_at',
      fieldType: 'date',
    },
    'status': {
      name: 'Status',
      fieldType: 'enumeration',
      options: [
        { key: 'draft', label: 'Draft' },
        { key: 'published', label: 'Published' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    'created_at': {
      name: 'Created at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};

function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}

function StatusFieldSortQuery(query, role) {
  query.modify('sortByStatus', role.order);
}
