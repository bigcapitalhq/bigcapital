import { Classes } from '@blueprintjs/core';
import React from 'react';
import { MoneyInContentFields } from './MoneyInContentFields';
import { useMoneyInDailogContext } from './MoneyInDialogProvider';
import { TransactionTypeFields } from './TransactionTypeFields';

/**
 * Money in form fields.
 */
export function MoneyInFormFields() {
  const { defaultAccountId } = useMoneyInDailogContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      {!defaultAccountId && <TransactionTypeFields />}
      <MoneyInContentFields />
    </div>
  );
}
