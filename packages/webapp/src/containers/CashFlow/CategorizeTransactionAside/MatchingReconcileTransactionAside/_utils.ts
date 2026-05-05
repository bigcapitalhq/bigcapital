import { nestedArrayToflatten } from '@/utils';
import { MatchingReconcileTransactionValues } from './_types';

const resolveTransactionType = (
  direction: 'deposit' | 'withdrawal',
  categoryRootType: string | undefined,
): string => {
  if (categoryRootType === 'equity') {
    return direction === 'deposit' ? 'owner_contribution' : 'owner_drawing';
  }
  return direction === 'deposit' ? 'other_income' : 'other_expense';
};

export const transformToReq = (
  values: MatchingReconcileTransactionValues,
  bankAccountId: number,
  accounts: any[] = [],
) => {
  const flatAccounts = nestedArrayToflatten(accounts);
  const categoryAccount = flatAccounts.find(
    (a: any) => a.id === Number(values.category),
  );
  const direction = values.type === 'deposit' ? 'deposit' : 'withdrawal';

  return {
    date: values.date,
    reference_no: values.referenceNo,
    transaction_type: resolveTransactionType(
      direction,
      categoryAccount?.account_root_type,
    ),
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
