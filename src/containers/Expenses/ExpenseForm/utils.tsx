import React from 'react';
import { AppToaster } from '@/components';
import { Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import moment from 'moment';
import intl from 'react-intl-universal';
import * as R from 'ramda';
import { first, sumBy } from 'lodash';
import { useExpenseFormContext } from './ExpenseFormPageProvider';

import {
  defaultFastFieldShouldUpdate,
  transformToForm,
  repeatValue,
  ensureEntriesHasEmptyLine,
  orderingLinesIndexes,
  formattedAmount,
} from '@/utils';
import { useCurrentOrganization } from '@/hooks/state';

const ERROR = {
  EXPENSE_ALREADY_PUBLISHED: 'EXPENSE.ALREADY.PUBLISHED',
  ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED:
    'ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED',
};

export const MIN_LINES_NUMBER = 1;

export const defaultExpenseEntry = {
  amount: '',
  expense_account_id: '',
  description: '',
  landed_cost: 0,
};

export const defaultExpense = {
  payment_account_id: '',
  beneficiary: '',
  payment_date: moment(new Date()).format('YYYY-MM-DD'),
  description: '',
  reference_no: '',
  currency_code: '',
  publish: '',
  branch_id: '',
  exchange_rate: 1,
  categories: [...repeatValue(defaultExpenseEntry, MIN_LINES_NUMBER)],
};

/**
 * Transform API errors in toasts messages.
 */
export const transformErrors = (errors, { setErrors }) => {
  const hasError = (errorType) => errors.some((e) => e.type === errorType);

  if (hasError(ERROR.EXPENSE_ALREADY_PUBLISHED)) {
    setErrors(
      AppToaster.show({
        message: intl.get('the_expense_is_already_published'),
      }),
    );
  }
  if (hasError(ERROR.ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED)) {
    setErrors(
      AppToaster.show({
        intent: Intent.DANGER,
        message: 'ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED',
      }),
    );
  }
};

/**
 * Transformes the expense to form initial values in edit mode.
 */
export const transformToEditForm = (
  expense,
  defaultExpense,
  linesNumber = 4,
) => {
  const expenseEntry = defaultExpense.categories[0];
  const initialEntries = [
    ...expense.categories.map((category) => ({
      ...transformToForm(category, expenseEntry),
    })),
    ...repeatValue(
      expenseEntry,
      Math.max(linesNumber - expense.categories.length, 0),
    ),
  ];
  const categories = R.compose(
    ensureEntriesHasEmptyLine(MIN_LINES_NUMBER, expenseEntry),
  )(initialEntries);

  return {
    ...transformToForm(expense, defaultExpense),
    categories,
  };
};

/**
 * Detarmine cusotmers fast-field should update.
 */
export const customersFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.customers !== oldProps.customers ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmine accounts fast-field should update.
 */
export const accountsFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.accounts !== oldProps.accounts ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Filter expense entries that has no amount or expense account.
 */
export const filterNonZeroEntries = (categories) => {
  return categories.filter(
    (category) => category.amount && category.expense_account_id,
  );
};

/**
 * Transformes the form values to request body.
 */
export const transformFormValuesToRequest = (values) => {
  const categories = filterNonZeroEntries(values.categories);

  return {
    ...values,
    categories: R.compose(orderingLinesIndexes)(categories),
  };
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = useExpenseFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

/**
 * Retreives the Journal totals.
 */
export const useExpensesTotals = () => {
  const {
    values: { categories, currency_code: currencyCode },
  } = useFormikContext();

  const total = sumBy(categories, 'amount');

  // Retrieves the formatted total money.
  const formattedTotal = React.useMemo(
    () => formattedAmount(total, currencyCode),
    [total, currencyCode],
  );
  // Retrieves the formatted subtotal.
  const formattedSubtotal = React.useMemo(
    () => formattedAmount(total, currencyCode, { money: false }),
    [total, currencyCode],
  );

  return {
    formattedTotal,
    formattedSubtotal,
  };
};

/**
 * Detarmines whether the expenses has foreign .
 * @returns {boolean}
 */
export const useExpensesIsForeign = () => {
  const { values } = useFormikContext();
  const currentOrganization = useCurrentOrganization();

  const isForeignExpenses = React.useMemo(
    () => values.currency_code !== currentOrganization.base_currency,
    [values.currency_code, currentOrganization.base_currency],
  );
  return isForeignExpenses;
};
