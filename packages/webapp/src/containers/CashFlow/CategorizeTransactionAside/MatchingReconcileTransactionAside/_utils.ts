import { MatchingReconcileTransactionValues } from './_types';

export const transformToReq = (
  values: MatchingReconcileTransactionValues,
  bankAccountId: number,
) => {
  return {
    date: values.date,
    reference_no: values.referenceNo,
    transaction_type:
      values.type === 'deposit' ? 'other_income' : 'other_expense',
    description: values.memo,
    amount: values.amount,
    credit_account_id: values.category,
    cashflow_account_id: bankAccountId,
    branch_id: values.branchId,
    publish: true,
  };
};


export const initialValues = {
  type: 'deposit',
  date: '',
  amount: '',
  memo: '',
  referenceNo: '',
  category: '',
  branchId: '',
};
