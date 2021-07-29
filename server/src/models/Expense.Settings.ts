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
      fieldRelation: 'paymentAccount',

      fieldRelationType: 'enumeration',
      relationLabelField: 'name',
      relationKeyField: 'slug',
    },
    'amount': {
      name: 'Amount',
      column: 'total_amount',
      fieldType: 'number',
    },
    // currency_code: {
    //   name: 'Currency',
    //   column: 'currency_code',
    // },
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
        { key: 'draft', name: 'Draft' },
        { key: 'published', name: 'Published' },
      ],
      filterQuery: statusFieldFilterQuery,
      sortQuery: statusFieldSortQuery,
    },
    'created_at': {
      name: 'Created at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};

function statusFieldFilterQuery(query, role) {
  switch (role.value) {
    case 'draft':
      query.modify('filterByDraft');
      break;
    case 'published':
      query.modify('filterByPublished');
      break;
  }
}

function statusFieldSortQuery(query, role) {
  return query.modify('sortByStatus', role.order);
}
