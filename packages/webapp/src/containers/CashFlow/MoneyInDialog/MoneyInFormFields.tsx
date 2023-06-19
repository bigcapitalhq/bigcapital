// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { Classes } from '@blueprintjs/core';

import { If } from '@/components';
import MoneyInContentFields from './MoneyInContentFields';
import TransactionTypeFields from './TransactionTypeFields';
import { useMoneyInDialogContext } from './MoneyInDialogProvider';

/**
 * Money in form fields.
 */
function MoneyInFormFields() {
  const { values } = useFormikContext();

  // Money in dialog context.
  const { accountId } = useMoneyInDialogContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      <If condition={!accountId}>
        <TransactionTypeFields />
      </If>
      <MoneyInContentFields accountType={values.transaction_type} />
    </div>
  );
}

export default MoneyInFormFields;
