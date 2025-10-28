// @ts-nocheck
import * as R from 'ramda';
import { transformToForm, transfromToSnakeCase } from '@/utils';
import { useCategorizeTransactionBoot } from './CategorizeTransactionBoot';
import { GetAutofillCategorizeTransaction } from '@/hooks/query/bank-rules';

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
  autofillCategorizeTransaction: GetAutofillCategorizeTransaction,
) => {
  return transformToForm(autofillCategorizeTransaction, defaultInitialValues);
};

export const tranformToRequest = (
  formValues: Record<string, any>,
  uncategorizedTransactionIds: Array<number>,
) => {
  return {
    uncategorized_transaction_ids: uncategorizedTransactionIds,
    ...transfromToSnakeCase(formValues),
  };
};

/**
 * Categorize transaction form initial values.
 * @returns
 */
export const useCategorizeTransactionFormInitialValues = () => {
  const { primaryBranch, autofillCategorizeValues } =
    useCategorizeTransactionBoot();

  return {
    ...defaultInitialValues,
    /**
     * We only care about the fields in the form. Previously unfilled optional
     * values such as `notes` come back from the API as null, so remove those
     * as well.
     */
    ...transformToCategorizeForm(autofillCategorizeValues),

    /** Assign the primary branch id as default value. */
    branchId: primaryBranch?.id || null,
  };
};
