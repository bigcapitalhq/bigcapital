
export default {
  fields: {
    customer: {
      name: 'Customer',
      column: 'customer_id',
    },
    payment_date: {
      name: 'Payment date',
      column: 'payment_date',
      fieldType: 'date',
    },
    amount: {
      name: 'Amount',
      column: 'amount',
      fieldType: 'number',
    },
    reference_no: {
      name: 'Reference No.',
      column: 'reference_no',
      fieldType: 'text',
    },
    deposit_account: {
      name: 'Deposit account',
      column: 'deposit_account_id',
    },
    payment_receive_no: {
      name: 'Payment receive No.',
      column: 'payment_receive_no',
      fieldType: 'text',
    },
    statement: {
      name: 'Statement',
      column: 'statement',
      fieldType: 'text',
    },
    created_at: {
      name: 'Created at',
      column: 'created_at',
      fieldDate: 'date',
    },
  },
};
