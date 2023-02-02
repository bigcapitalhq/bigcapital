// @ts-nocheck
import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { FormattedMessage as T } from '@/components';

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
  AccountsSuggestField,
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

  const { accounts ,invoice } = useBadDebtContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      <Callout intent={Intent.PRIMARY}>
        <p>
          <T id={'bad_debt.dialog.header_note'} />
        </p>
      </Callout>

      {/*------------ Written-off amount -----------*/}
      <FastField name={'amount'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={<T id={'bad_debt.dialog.written_off_amount'} />}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--amount', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="amount" />}
          >
            <ControlGroup>
              <InputPrependText text={invoice.currency_code} />

              <MoneyInputGroup
                value={value}
                minimal={true}
                onChange={(amount) => {
                  setFieldValue('amount', amount);
                }}
                intent={inputIntent({ error, touched })}
                disabled={amountfieldRef}
              />
            </ControlGroup>
          </FormGroup>
        )}
      </FastField>
      {/*------------ Expense account -----------*/}
      <FastField name={'expense_account_id'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'expense_account_id'} />}
            className={classNames(
              'form-group--expense_account_id',
              'form-group--select-list',
              CLASSES.FILL,
            )}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'expense_account_id'} />}
          >
            <AccountsSuggestField
              selectedAccountId={value}
              accounts={accounts}
              onAccountSelected={({ id }) =>
                form.setFieldValue('expense_account_id', id)
              }
              filterByTypes={[ACCOUNT_TYPE.EXPENSE]}
            />
          </FormGroup>
        )}
      </FastField>
      {/*------------ reason -----------*/}
      <FastField name={'reason'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reason'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--reason'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'reason'} />}
          >
            <TextArea
              growVertically={true}
              large={true}
              intent={inputIntent({ error, touched })}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

export default BadDebtFormFields;
