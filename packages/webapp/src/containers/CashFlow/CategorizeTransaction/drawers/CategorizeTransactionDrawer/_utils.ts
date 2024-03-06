// @ts-nocheck
import { transformToForm, transfromToSnakeCase } from '@/utils';

// Default initial form values.
export const defaultInitialValues = {
  amount: '',
  date: '',
  creditAccountId: '',
  debitAccountId: '',
  exchangeRate: '1',
  transactionType: '',
  referenceNo: '',
  description: '',
};

export const transformToCategorizeForm = (uncategorizedTransaction) => {
  const defaultValues = {
    debitAccountId: uncategorizedTransaction.account_id,
    transactionType: uncategorizedTransaction.is_deposit_transaction
      ? 'other_income'
      : 'other_expense',
    amount: uncategorizedTransaction.amount,
    date: uncategorizedTransaction.date,
  };
  return transformToForm(defaultValues, defaultInitialValues);
};


export const tranformToRequest = (formValues) => {
  return transfromToSnakeCase(formValues);
};