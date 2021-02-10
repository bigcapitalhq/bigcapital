import { AppToaster } from 'components';
import { formatMessage } from 'services/intl';

const ERROR = {
  EXPENSE_ALREADY_PUBLISHED: 'EXPENSE.ALREADY.PUBLISHED',
};

// Transform API errors in toasts messages.
export const transformErrors = (errors, { setErrors }) => {
  const hasError = (errorType) => errors.some((e) => e.type === errorType);

  if (hasError(ERROR.EXPENSE_ALREADY_PUBLISHED)) {
    setErrors(
      AppToaster.show({
        message: formatMessage({
          id: 'the_expense_is_already_published',
        }),
      }),
    );
  }
};