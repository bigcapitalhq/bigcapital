import { AppToaster } from 'components';
import moment from 'moment';
import intl from 'react-intl-universal';
import { transformToForm, repeatValue } from 'utils';

const ERROR = {
  EXPENSE_ALREADY_PUBLISHED: 'EXPENSE.ALREADY.PUBLISHED',
};

// Transform API errors in toasts messages.
export const transformErrors = (errors, { setErrors }) => {
  const hasError = (errorType) => errors.some((e) => e.type === errorType);

  if (hasError(ERROR.EXPENSE_ALREADY_PUBLISHED)) {
    setErrors(
      AppToaster.show({
        message: intl.get('the_expense_is_already_published'),
      }),
    );
  }
};

export const MIN_LINES_NUMBER = 4;

export const defaultExpenseEntry = {
  index: 0,
  amount: '',
  expense_account_id: '',
  description: '',
  landed_cost: false,
};

export const defaultExpense = {
  payment_account_id: '',
  beneficiary: '',
  payment_date: moment(new Date()).format('YYYY-MM-DD'),
  description: '',
  reference_no: '',
  currency_code: '',
  publish: '',
  categories: [...repeatValue(defaultExpenseEntry, MIN_LINES_NUMBER)],
};

/**
 * Transformes the expense to form initial values in edit mode.
 */
export const transformToEditForm = (
  expense,
  defaultExpense,
  linesNumber = 4,
) => {
  return {
    ...transformToForm(expense, defaultExpense),
    categories: [
      ...expense.categories.map((category) => ({
        ...transformToForm(category, defaultExpense.categories[0]),
      })),
      ...repeatValue(
        expense,
        Math.max(linesNumber - expense.categories.length, 0),
      ),
    ],
  };
};
