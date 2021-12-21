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
      key: 'preferred_deposit_account',
      value: option.preferred_deposit_account,
      group: 'payment_receives',
    },
    {
      key: 'preferred_advance_deposit',
      value: option.preferred_advance_deposit,
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


