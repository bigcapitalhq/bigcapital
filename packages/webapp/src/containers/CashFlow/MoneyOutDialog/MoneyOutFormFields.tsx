// @ts-nocheck
import React from 'react';
import { Classes } from '@blueprintjs/core';

import MoneyOutContentFields from './MoneyOutContentFields';
import TransactionTypeFields from './TransactionTypeFields';

/**
 * Money out form fields.
 */
function MoneyOutFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      <TransactionTypeFields />
      <MoneyOutContentFields />
    </div>
  );
}

export default MoneyOutFormFields;
