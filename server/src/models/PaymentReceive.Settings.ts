
export default {
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
};
