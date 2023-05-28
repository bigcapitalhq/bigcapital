// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { Classes } from '@blueprintjs/core';

import { If } from '@/components';

import MoneyOutContentFields from './MoneyOutContentFields';
import TransactionTypeFields from './TransactionTypeFields';
import { useMoneyOutDialogContext } from './MoneyOutDialogProvider';

/**
 * Money out form fields.
 */
function MoneyOutFormFields() {
  // Money in dialog context.
  const { accountId } = useMoneyOutDialogContext();

  const { values } = useFormikContext();
  return (
    <div className={Classes.DIALOG_BODY}>
      <If condition={!accountId}>
        <TransactionTypeFields />
      </If>
      <MoneyOutContentFields accountType={values.transaction_type} />
    </div>
  );
}

export default MoneyOutFormFields;
