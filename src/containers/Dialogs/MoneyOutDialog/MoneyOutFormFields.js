import React from 'react';
import { Classes } from '@blueprintjs/core';

import { If } from 'components';

import MoneyOutContentFields from './MoneyOutContentFields';
import TransactionTypeFields from './TransactionTypeFields';
import { useMoneyOutDialogContext } from './MoneyOutDialogProvider';

/**
 * Money out form fields.
 */
function MoneyOutFormFields() {
  // Money in dialog context.
  const { accountId, accountType } = useMoneyOutDialogContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      <If condition={!accountId}>
        <TransactionTypeFields />
      </If>
      <MoneyOutContentFields accountType={accountType} />
    </div>
  );
}

export default MoneyOutFormFields;
