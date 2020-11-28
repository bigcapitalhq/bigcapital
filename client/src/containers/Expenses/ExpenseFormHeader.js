import React from 'react';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';

import ExpenseFormHeaderFields from './ExpenseFormHeaderFields';
import { PageFormBigNumber } from 'components';

// Expense form header.
export default function ExpenseFormHeader() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <ExpenseFormHeaderFields />

      <PageFormBigNumber
        label={'Expense Amount'}
        amount={0}
        currencyCode={'LYD'}
      />
    </div>
  )
}