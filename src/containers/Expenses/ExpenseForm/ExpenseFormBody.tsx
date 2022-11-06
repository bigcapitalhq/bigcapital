// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import ExpenseFormEntriesField from './ExpenseFormEntriesField';

export default function ExpenseFormBody() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <ExpenseFormEntriesField />
    </div>
  );
}
