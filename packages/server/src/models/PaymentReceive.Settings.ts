export default {
  importable: true,
  exportable: true,
  importAggregator: 'group',
  importAggregateOn: 'entries',
  importAggregateBy: 'paymentReceiveNo',
  fields: {
    customer: {
      name: 'payment_receive.field.customer',
      column: 'customer_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'customer',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    payment_date: {
      name: 'payment_receive.field.payment_date',
      column: 'payment_date',
      fieldType: 'date',
    },
    amount: {
      name: 'payment_receive.field.amount',
      column: 'amount',
      fieldType: 'number',
    },
    reference_no: {
      name: 'payment_receive.field.reference_no',
      column: 'reference_no',
      fieldType: 'text',
    },
    deposit_account: {
      name: 'payment_receive.field.deposit_account',
      column: 'deposit_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'depositAccount',

      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    payment_receive_no: {
      name: 'payment_receive.field.payment_receive_no',
      column: 'payment_receive_no',
      fieldType: 'text',
    },
    statement: {
      name: 'payment_receive.field.statement',
      column: 'statement',
      fieldType: 'text',
    },
    created_at: {
      name: 'payment_receive.field.created_at',
      column: 'created_at',
      fieldDate: 'date',
    },
  },
  columns: {
    customer: {
      name: 'payment_receive.field.customer',
      accessor: 'customer.displayName',
      type: 'text',
    },
    paymentDate: {
      name: 'payment_receive.field.payment_date',
      type: 'date',
      accessor: 'formattedPaymentDate',
    },
    amount: {
      name: 'payment_receive.field.amount',
      type: 'number',
      accessor: 'formattedAmount'
    },
    referenceNo: {
      name: 'payment_receive.field.reference_no',
      type: 'text',
    },
    depositAccount: {
      name: 'payment_receive.field.deposit_account',
      accessor: 'depositAccount.name',
      type: 'text',
    },
    paymentReceiveNo: {
      name: 'payment_receive.field.payment_receive_no',
      type: 'text',
    },
    statement: {
      name: 'payment_receive.field.statement',
      type: 'text',
      printable: false,
    },
    created_at: {
      name: 'payment_receive.field.created_at',
      type: 'date',
      printable: false,
    },
  },
  fields2: {
    customerId: {
      name: 'payment_receive.field.customer',
      fieldType: 'relation',
      relationModel: 'Contact',
      relationImportMatch: ['displayName'],
      required: true,
    },
    exchangeRate: {
      name: 'payment_receive.field.exchange_rate',
      fieldType: 'number',
    },
    paymentDate: {
      name: 'payment_receive.field.payment_date',
      fieldType: 'date',
      required: true,
    },
    referenceNo: {
      name: 'payment_receive.field.reference_no',
      fieldType: 'text',
    },
    depositAccountId: {
      name: 'payment_receive.field.deposit_account',
      fieldType: 'relation',
      relationModel: 'Account',
      relationImportMatch: ['name', 'code'],
      required: true,
      importHint: 'Matches the account name or code.',
    },
    paymentReceiveNo: {
      name: 'payment_receive.field.payment_receive_no',
      fieldType: 'text',
      importHint: 'The payment number should be unique.',
    },
    statement: {
      name: 'payment_receive.field.statement',
      fieldType: 'text',
    },
    entries: {
      name: 'payment_receive.field.entries',
      fieldType: 'collection',
      collectionOf: 'object',
      collectionMinLength: 1,
      required: true,
      fields: {
        invoiceId: {
          name: 'payment_receive.field.invoice',
          fieldType: 'relation',
          relationModel: 'SaleInvoice',
          relationImportMatch: 'invoiceNo',
          required: true,
          importHint: 'Matches the invoice number.',
        },
        paymentAmount: {
          name: 'payment_receive.field.entries.payment_amount',
          fieldType: 'number',
          required: true,
        },
      },
    },
  },
};
