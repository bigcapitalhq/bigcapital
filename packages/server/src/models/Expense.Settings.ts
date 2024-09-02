import { Features } from '@/interfaces';

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
  exportFlattenOn: 'categories',
  exportable: true,
  print: {
    pageTitle: 'Expenses',
  },
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
    created_at: {
      name: 'expense.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
  columns: {
    paymentReceive: {
      name: 'expense.field.payment_account',
      type: 'text',
      accessor: 'paymentAccount.name',
    },
    referenceNo: {
      name: 'expense.field.reference_no',
      type: 'text',
    },
    paymentDate: {
      name: 'expense.field.payment_date',
      accessor: 'formattedDate',
      type: 'date',
    },
    currencyCode: {
      name: 'expense.field.currency_code',
      type: 'text',
      printable: false,
    },
    exchangeRate: {
      name: 'expense.field.exchange_rate',
      type: 'number',
      printable: false,
    },
    description: {
      name: 'expense.field.description',
      type: 'text',
    },
    categories: {
      name: 'expense.field.categories',
      type: 'collection',
      collectionOf: 'object',
      columns: {
        expenseAccount: {
          name: 'expense.field.expense_account',
          accessor: 'expenseAccount.name',
        },
        amount: {
          name: 'expense.field.amount',
          accessor: 'amountFormatted',
        },
        description: {
          name: 'expense.field.line_description',
          type: 'text',
        },
      },
    },
    publish: {
      name: 'expense.field.publish',
      type: 'boolean',
      printable: false,
    },
    branch: {
      name: 'Branch',
      type: 'text',
      accessor: 'branch.name',
      features: [Features.BRANCHES],
    },
  },
  fields2: {
    paymentAccountId: {
      name: 'expense.field.payment_account',
      fieldType: 'relation',
      relationModel: 'Account',
      relationImportMatch: ['name', 'code'],
      required: true,
      importHint: 'Matches the account name or code.',
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
          importHint: 'Matches the account name or code.',
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
    branchId: {
      name: 'Branch',
      fieldType: 'relation',
      relationModel: 'Branch',
      relationImportMatch: ['name', 'code'],
      features: [Features.BRANCHES],
      required: true,
    },
  },
};

function StatusFieldFilterQuery(query, role) {
  query.modify('filterByStatus', role.value);
}

function StatusFieldSortQuery(query, role) {
  query.modify('sortByStatus', role.order);
}
