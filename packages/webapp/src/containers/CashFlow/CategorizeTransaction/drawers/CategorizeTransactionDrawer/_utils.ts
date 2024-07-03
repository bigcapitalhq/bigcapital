// @ts-nocheck
import * as R from 'ramda';
import { transformToForm, transfromToSnakeCase } from '@/utils';
import { useCategorizeTransactionTabsBoot } from '@/containers/CashFlow/CategorizeTransactionAside/CategorizeTransactionTabsBoot';
import { useCategorizeTransactionBoot } from './CategorizeTransactionBoot';

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
  branchId: '',
};

export const transformToCategorizeForm = (
  uncategorizedTransaction: any,
  recognizedTransaction?: any,
) => {
  let defaultValues = {
    debitAccountId: uncategorizedTransaction.account_id,
    transactionType: uncategorizedTransaction.is_deposit_transaction
      ? 'other_income'
      : 'other_expense',
    amount: uncategorizedTransaction.amount,
    date: uncategorizedTransaction.date,
  };
  if (recognizedTransaction) {
    const recognizedDefaults = getRecognizedTransactionDefaultValues(
      recognizedTransaction,
    );
    defaultValues = R.merge(defaultValues, recognizedDefaults);
  }
  return transformToForm(defaultValues, defaultInitialValues);
};

export const getRecognizedTransactionDefaultValues = (
  recognizedTransaction: any,
) => {
  return {
    creditAccountId: recognizedTransaction.assignedAccountId || '',
    // transactionType: recognizedTransaction.assignCategory,
    referenceNo: recognizedTransaction.referenceNo || '',
  };
};

export const tranformToRequest = (formValues: Record<string, any>) => {
  return transfromToSnakeCase(formValues);
};

/**
 * Categorize transaction form initial values.
 * @returns
 */
export const useCategorizeTransactionFormInitialValues = () => {
  const { primaryBranch, recognizedTranasction } =
    useCategorizeTransactionBoot();
  const { uncategorizedTransaction } = useCategorizeTransactionTabsBoot();

  return {
    ...defaultInitialValues,
    /**
     * We only care about the fields in the form. Previously unfilled optional
     * values such as `notes` come back from the API as null, so remove those
     * as well.
     */
    ...transformToCategorizeForm(
      uncategorizedTransaction,
      recognizedTranasction,
    ),

    /** Assign the primary branch id as default value. */
    branchId: primaryBranch?.id || null,
  };
};
