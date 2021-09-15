export default {
  defaultFilterField: 'vendor',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'bill_date',
  },
  fields: {
    vendor: {
      name: 'bill_payment.field.vendor',
      column: 'vendor_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'vendor',

      relationEntityLabel: 'display_name',
      relationEntityKey: 'id',
    },
    amount: {
      name: 'bill_payment.field.amount',
      column: 'amount',
      fieldType: 'number',
    },
    due_amount: {
      name: 'bill_payment.field.due_amount',
      column: 'due_amount',
      fieldType: 'number',
    },
    payment_account: {
      name: 'bill_payment.field.payment_account',
      column: 'payment_account_id',
      fieldType: 'relation',

      relationType: 'enumeration',
      relationKey: 'paymentAccount',
      
      relationEntityLabel: 'name',
      relationEntityKey: 'slug',
    },
    payment_number: {
      name: 'bill_payment.field.payment_number',
      column: 'payment_number',
      fieldType: 'text',
    },
    payment_date: {
      name: 'bill_payment.field.payment_date',
      column: 'payment_date',
      fieldType: 'date',
    },
    reference_no: {
      name: 'bill_payment.field.reference_no',
      column: 'reference',
      fieldType: 'text',
    },
    description: {
      name: 'bill_payment.field.description',
      column: 'description',
      fieldType: 'text',
    },
    created_at: {
      name: 'bill_payment.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};
