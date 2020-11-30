import React, { useMemo } from 'react';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';

import { CLASSES } from 'common/classes';

import ExpenseFormHeaderFields from './ExpenseFormHeaderFields';
import { PageFormBigNumber } from 'components';

// Expense form header.
export default function ExpenseFormHeader() {
  const { values } = useFormikContext();

  // Calculates the expense entries amount.
  const totalExpenseAmount = useMemo(() => sumBy(values.categories, 'amount'), [
    values.categories,
  ]);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <ExpenseFormHeaderFields />
      <PageFormBigNumber
        label={'Expense Amount'}
        amount={totalExpenseAmount}
        currencyCode={'LYD'}
      />
    </div>
  );
}
