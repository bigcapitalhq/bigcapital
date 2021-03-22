export const transformToOptions = (option) => {
  return [
    {
      key: 'accounting_basis',
      value: option.accounting_basis,
      group: 'organization',
    },
    {
      key: 'withdrawal_account',
      value: option.withdrawal_account,
      group: 'bill_payments',
    },
    {
      key: 'deposit_account',
      value: option.deposit_account,
      group: 'payment_receives',
    },
    {
      key: 'advance_deposit',
      value: option.advance_deposit,
      group: 'payment_receives',
    },
    {
      key: 'account_code_required',
      value: option.account_code_required,
      group: 'accounts',
    },
    {
      
      key: 'account_code_unique',
      value: option.account_code_unique,
      group: 'accounts',
    },
  ];
};


