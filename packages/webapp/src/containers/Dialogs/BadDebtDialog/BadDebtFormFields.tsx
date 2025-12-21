// @ts-nocheck
import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import {
  FMoneyInputGroup,
  FTextArea,
  FormattedMessage as T,
} from '@/components';

import { useAutofocus } from '@/hooks';
import {
  Classes,
  FormGroup,
  TextArea,
  ControlGroup,
  Callout,
  Intent,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { inputIntent } from '@/utils';
import {
  FAccountsSuggestField,
  InputPrependText,
  MoneyInputGroup,
  FieldRequiredHint,
} from '@/components';

import { useBadDebtContext } from './BadDebtFormProvider';

/**
 * Bad debt form fields.
 */
function BadDebtFormFields() {
  const amountfieldRef = useAutofocus();

  const { accounts, invoice } = useBadDebtContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      <Callout intent={Intent.PRIMARY}>
        <p>
          <T id={'bad_debt.dialog.header_note'} />
        </p>
      </Callout>

      {/*------------ Written-off amount -----------*/}
      <FFormGroup
        name={'amount'}
        label={<T id={'bad_debt.dialog.written_off_amount'} />}
        labelInfo={<FieldRequiredHint />}
        fill
      >
        <ControlGroup>
          <InputPrependText text={invoice.currency_code} />
          <FMoneyInputGroup
            name={'amount'}
            minimal={true}
            inputRef={(ref) => (amountfieldRef.current = ref)}
          />
        </ControlGroup>
      </FFormGroup>

      {/*------------ Expense account -----------*/}
      <FFormGroup
        name={'expense_account_id'}
        label={<T id={'expense_account_id'} />}
        labelInfo={<FieldRequiredHint />}
        fill
      >
        <FAccountsSuggestField
          name={'expense_account_id'}
          items={accounts}
          filterByTypes={[ACCOUNT_TYPE.EXPENSE]}
        />
      </FFormGroup>

      {/*------------ reason -----------*/}
      <FFormGroup
        name={'reason'}
        label={<T id={'reason'} />}
        labelInfo={<FieldRequiredHint />}
        fill
      >
        <FTextArea name={'reason'} growVertically={true} large={true} fill />
      </FFormGroup>
    </div>
  );
}

export default BadDebtFormFields;
