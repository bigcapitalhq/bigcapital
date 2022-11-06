// @ts-nocheck
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from '@/components';
import { CLASSES } from '@/constants/classes';


import ExpenseFormHeaderFields from './ExpenseFormHeaderFields';
import { PageFormBigNumber } from '@/components';

// Expense form header.
export default function ExpenseFormHeader() {
  const {
    values: { currency_code, categories },
  } = useFormikContext();

  // Calculates the expense entries amount.
  const totalExpenseAmount = useMemo(
    () => sumBy(categories, 'amount'),
    [categories],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <ExpenseFormHeaderFields />
      <PageFormBigNumber
        label={<T id={'expense_amount'} />}
        amount={totalExpenseAmount}
        currencyCode={currency_code}
      />
    </div>
  );
}
