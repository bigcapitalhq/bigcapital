// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import intl from 'react-intl-universal';
import moment from 'moment';
import { AppToaster } from '@/components';
import { Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
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
import {
  transformAttachmentsToForm,
  transformAttachmentsToRequest,
} from '@/containers/Attachments/utils';

const ERROR = {
  EXPENSE_ALREADY_PUBLISHED: 'EXPENSE.ALREADY.PUBLISHED',
  ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED:
    'ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED',
};

export const MIN_LINES_NUMBER = 1;
export const MIN_PAYMENT_SPLIT_LINES = 1;

export const defaultExpenseEntry = {
  amount: '',
  expense_account_id: '',
  description: '',
  landed_cost: 0,
  project_id: '',
  amount_type: 'fixed',
  percent: '',
};

export const defaultPaymentSplit = {
  payment_account_id: '',
  amount: '',
};

export const defaultExpense = {
  payee_id: '',
  beneficiary: '',
  payment_date: moment(new Date()).format('YYYY-MM-DD'),
  description: '',
  reference_no: '',
  currency_code: '',
  publish: '',
  branch_id: '',
  exchange_rate: 1,
  categories: [...repeatValue(defaultExpenseEntry, MIN_LINES_NUMBER)],
  payment_splits: [...repeatValue(defaultPaymentSplit, MIN_PAYMENT_SPLIT_LINES)],
  attachments: [],
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
      amount_type: category.amount_type || 'fixed',
      percent: category.percent ?? '',
    })),
    ...repeatValue(
      expenseEntry,
      Math.max(linesNumber - expense.categories.length, 0),
    ),
  ];
  const categories = R.compose(
    ensureEntriesHasEmptyLine(MIN_LINES_NUMBER, expenseEntry),
  )(initialEntries);

  // Hydrate payment splits from the server response. Fall back to a single
  // split synthesized from the legacy `payment_account_id` + `total_amount`
  // so older rows render as a one-row table.
  const splitSource =
    expense.payment_splits && expense.payment_splits.length > 0
      ? expense.payment_splits
      : expense.payment_account_id
      ? [
          {
            payment_account_id: expense.payment_account_id,
            amount: expense.total_amount,
          },
        ]
      : [];
  const paymentSplits =
    splitSource.length > 0
      ? splitSource.map((split) => ({
          // Preserve the server id so an edit updates this split in place
          // rather than delete-and-reinsert, which would orphan matched
          // bank transactions referencing this split id.
          ...(split.id != null ? { id: split.id } : {}),
          payment_account_id: split.payment_account_id,
          amount: split.amount,
        }))
      : [...repeatValue(defaultExpense.payment_splits[0], MIN_PAYMENT_SPLIT_LINES)];

  const attachments = transformAttachmentsToForm(expense);

  return {
    ...transformToForm(expense, defaultExpense),
    categories,
    payment_splits: paymentSplits,
    attachments,
  };
};

/**
 * Detarmine cusotmers fast-field should update.
 */
export const customersFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.shouldUpdateDeps.items !== oldProps.shouldUpdateDeps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmine accounts fast-field should update.
 */
export const accountsFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.items !== oldProps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmine vendors fast-field should update.
 */
export const vendorsFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.shouldUpdateDeps?.items !== oldProps.shouldUpdateDeps?.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Filter expense entries that has no amount or expense account.
 */
export const filterNonZeroEntries = (categories) => {
  return categories.filter((category) => {
    if (!category.expense_account_id) return false;
    const percent = Number(category.percent);
    if (percent > 0) return true;
    return Number(category.amount) > 0;
  });
};

/**
 * Resolves the total expense amount from the payment splits. Percent-typed
 * categories compute their amount from this total.
 */
const getPaymentSplitsTotal = (paymentSplits = []) =>
  sumBy(
    paymentSplits.filter((s) => s.payment_account_id && Number(s.amount) > 0),
    (s) => Number(s.amount) || 0,
  );

/**
 * Normalize a category entry for submit: compute the effective amount when
 * the row is percent-typed; ensure fixed rows carry a numeric amount.
 */
const normalizeCategoryForRequest = (category, total) => {
  // Amount type is derived from the presence of a positive percent value.
  const percent = Number(category.percent);
  if (percent > 0) {
    const amount = Math.round(((total * percent) / 100) * 1000) / 1000;
    return {
      ...category,
      amount_type: 'percent',
      percent,
      amount,
    };
  }
  return {
    ...category,
    amount_type: 'fixed',
    percent: null,
    amount: Number(category.amount) || 0,
  };
};

/**
 * Filter out empty payment splits (rows with no account or no amount).
 */
export const filterNonZeroPaymentSplits = (paymentSplits = []) =>
  paymentSplits.filter(
    (split) => split.payment_account_id && Number(split.amount) > 0,
  );

/**
 * Transformes the form values to request body.
 */
export const transformFormValuesToRequest = (values) => {
  const paymentSplits = filterNonZeroPaymentSplits(values.payment_splits || []);
  const total = getPaymentSplitsTotal(paymentSplits);
  const normalizedCategories = (values.categories || []).map((c) =>
    normalizeCategoryForRequest(c, total),
  );
  const categories = filterNonZeroEntries(normalizedCategories);
  const attachments = transformAttachmentsToRequest(values);

  return {
    ...values,
    categories: R.compose(orderingLinesIndexes)(categories),
    payment_splits: paymentSplits.map((split, i) => ({
      ...(split.id != null ? { id: split.id } : {}),
      index: i + 1,
      payment_account_id: split.payment_account_id,
      amount: Number(split.amount) || 0,
    })),
    attachments,
  };
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess, isNewMode } = useExpenseFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess && isNewMode) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches, isNewMode]);
};

/**
 * Retrieves the expense subtotal — sum of authored category amounts,
 * including percent-typed rows computed against the payments total.
 * @returns {number}
 */
export const useExpenseSubtotal = () => {
  const {
    values: { categories, payment_splits },
  } = useFormikContext();

  const paymentsTotal = React.useMemo(
    () => getPaymentSplitsTotal(payment_splits || []),
    [payment_splits],
  );

  return React.useMemo(
    () =>
      sumBy(categories || [], (c) => {
        const pct = Number(c.percent);
        if (pct > 0) {
          return Math.round(((paymentsTotal * pct) / 100) * 1000) / 1000;
        }
        return Number(c.amount) || 0;
      }),
    [categories, paymentsTotal],
  );
};

/**
 * Retrieves the expense payments total (sum of payment split amounts).
 * @returns {number}
 */
export const useExpensePaymentsTotal = () => {
  const {
    values: { payment_splits },
  } = useFormikContext();
  return React.useMemo(
    () => getPaymentSplitsTotal(payment_splits || []),
    [payment_splits],
  );
};

/**
 * Amount remaining to be allocated across categories. Positive = under-allocated.
 */
export const useExpenseRemaining = () => {
  const paymentsTotal = useExpensePaymentsTotal();
  const categoriesTotal = useExpenseSubtotal();
  return React.useMemo(
    () => Math.round((paymentsTotal - categoriesTotal) * 1000) / 1000,
    [paymentsTotal, categoriesTotal],
  );
};

/**
 * Retrieves the expense subtotal formatted.
 * @returns {string}
 */
export const useExpenseSubtotalFormatted = () => {
  const subtotal = useExpenseSubtotal();
  const {
    values: { currency_code },
  } = useFormikContext();

  return formattedAmount(subtotal, currency_code);
};

/**
 * Retrieves the expense total.
 * @returns {number}
 */
export const useExpenseTotal = () => {
  const subtotal = useExpenseSubtotal();

  return subtotal;
};

/**
 * Retrieves the expense total formatted.
 * @returns {string}
 */
export const useExpenseTotalFormatted = () => {
  const total = useExpenseTotal();
  const {
    values: { currency_code },
  } = useFormikContext();

  return formattedAmount(total, currency_code);
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
