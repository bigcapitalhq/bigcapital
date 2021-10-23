import React from 'react';
import { Classes } from '@blueprintjs/core';

import { If } from 'components';

import MoneyInContentFields from './MoneyInContentFields';
import TransactionTypeFields from './TransactionTypeFields';
import { useMoneyInDailogContext } from './MoneyInDialogProvider';

/**
 * Money in form fields.
 */
function MoneyInFormFields() {
  // Money in dialog context.
  const { accountId, accountType } = useMoneyInDailogContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      <If condition={!accountId}>
        <TransactionTypeFields />
      </If>
      <MoneyInContentFields accountType={accountType} />
    </div>
  );
}

export default MoneyInFormFields;
