import { Classes } from '@blueprintjs/core';
import React from 'react';
import { MoneyOutContentFields } from './MoneyOutContentFields';
import { TransactionTypeFields } from './TransactionTypeFields';

/**
 * Money out form fields.
 */
export function MoneyOutFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      <TransactionTypeFields />
      <MoneyOutContentFields />
    </div>
  );
}
