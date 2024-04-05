/**
 * Expense - Settings.
 */
export default {
  defaultFilterField: 'description',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'name',
  },
  importable: true,
  fields: {
    payment_date: {
      name: 'expense.field.payment_date',
      column: 'payment_date',
      fieldType: 'date',
    },
    payment_account: {
      name: 'expense.field.payment_account',
      column: 'payment_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'paymentAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    amount: {
      name: 'expense.field.amount',
      column: 'total_amount',
      fieldType: 'number',
    },
    reference_no: {
      name: 'expense.field.reference_no',
      column: 'reference_no',
      fieldType: 'text',
    },
    description: {
      name: 'expense.field.description',
      column: 'description',
      fieldType: 'text',
    },
    published: {
      name: 'expense.field.published',
      column: 'published_at',
      fieldType: 'date',
    },
    status: {
      name: 'expense.field.status',
      fieldType: 'enumeration',
      options: [
        { label: 'expense.field.status.draft', key: 'draft' },
        { label: 'expense.field.status.published', key: 'published' },
      ],
      filterCustomQuery: StatusFieldFilterQuery,
      sortCustomQuery: StatusFieldSortQuery,
    },
    createdAt: {
      name: 'expense.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
  fields2: {
    paymentAccountId: {
      name: 'expense.field.payment_account',
      fieldType: 'relation',
      relationModel: 'Account',
      relationImportMatch: ['name', 'code'], 
      required: true,
    },
    referenceNo: {
      name: 'expense.field.reference_no',
      fieldType: 'text',
    },
    paymentDate: {
      name: 'expense.field.payment_date',
      fieldType: 'date',
      required: true,
    },
    currencyCode: {
      name: 'expense.field.currency_code',
      fieldType: 'text',
    },
    exchangeRate: {
      name: 'expense.field.exchange_rate',
      fieldType: 'number',
    },
    description: {
      name: 'expense.field.description',
      fieldType: 'text',
    },
    categories: {
      name: 'expense.field.categories',
      fieldType: 'collection',
      collectionOf: 'object',
      fields: {
        expenseAccountId: {
          name: 'expense.field.expense_account',
          fieldType: 'relation',
          relationModel: 'Account',
          relationImportMatch: ['name', 'code'],
          required: true,
        },
        amount: {
          name: 'expense.field.amount',
          fieldType: 'number',
          required: true,
        },
        description: {
          name: 'expense.field.line_description',
          fieldType: 'text',
        },
      },
    },
    publish: {
      name: 'expense.field.publish',
      fieldType: 'boolean',
    },
  },
};

function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}

function StatusFieldSortQuery(query, role) {
  query.modify('sortByStatus', role.order);
}
