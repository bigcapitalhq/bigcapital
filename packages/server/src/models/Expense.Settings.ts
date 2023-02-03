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
      name: 'expense.field.payment_date',
      column: 'payment_date',
      fieldType: 'date',
    },
    'payment_account': {
      name: 'expense.field.payment_account',
      column: 'payment_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'paymentAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    'amount': {
      name: 'expense.field.amount',
      column: 'total_amount',
      fieldType: 'number',
    },
    'reference_no': {
      name: 'expense.field.reference_no',
      column: 'reference_no',
      fieldType: 'text',
    },
    'description': {
      name: 'expense.field.description',
      column: 'description',
      fieldType: 'text',
    },
    'published': {
      name: 'expense.field.published',
      column: 'published_at',
      fieldType: 'date',
    },
    'status': {
      name: 'expense.field.status',
      fieldType: 'enumeration',
      options: [
        { label: 'expense.field.status.draft', key: 'draft' },
        { label: 'expense.field.status.published', key: 'published' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    'created_at': {
      name: 'expense.field.created_at',
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
