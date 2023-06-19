// @ts-nocheck
import React, { useMemo } from 'react';
import { FastField, Field, ErrorMessage } from 'formik';
import { FormGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import {
  FormattedMessage as T,
  AccountsSuggestField,
  FieldRequiredHint,
  ListSelect,
  Col,
  Row,
} from '@/components';
import { inputIntent } from '@/utils';
import { CLASSES, getAddMoneyInOptions } from '@/constants';

import { useMoneyInDialogContext } from './MoneyInDialogProvider';

/**
 * Transaction type fields.
 */
export default function TransactionTypeFields() {
  // Money in dialog context.
  const { cashflowAccounts } = useMoneyInDialogContext();

  // Retrieves the add money in button options.
  const addMoneyInOptions = useMemo(() => getAddMoneyInOptions(), []);

  return (
    <div className="trasnaction-type-fileds">
      <Row>
        <Col xs={5}>
          {/*------------ Current account -----------*/}
          <FastField name={'cashflow_account_id'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'cash_flow_transaction.label_current_account'} />}
                labelInfo={<FieldRequiredHint />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="cashflow_account_id" />}
                minimal={true}
                className={classNames(
                  CLASSES.FILL,
                  'form-group--cashflow_account_id',
                )}
              >
                <AccountsSuggestField
                  accounts={cashflowAccounts}
                  onAccountSelected={({ id }) =>
                    form.setFieldValue('cashflow_account_id', id)
                  }
                  inputProps={{
                    intent: inputIntent({ error, touched }),
                  }}
                />
              </FormGroup>
            )}
          </FastField>
          {/*------------ Transaction type -----------*/}
        </Col>
        <Col xs={5}>
          <Field name={'transaction_type'}>
            {({
              form: { values, setFieldValue },
              field: { value },
              meta: { error, touched },
            }) => (
              <FormGroup
                label={<T id={'transaction_type'} />}
                labelInfo={<FieldRequiredHint />}
                helperText={<ErrorMessage name="transaction_type" />}
                intent={inputIntent({ error, touched })}
                className={classNames(
                  CLASSES.FILL,
                  'form-group--transaction_type',
                )}
              >
                <ListSelect
                  items={addMoneyInOptions}
                  onItemSelect={(type) => {
                    setFieldValue('transaction_type', type.value);
                  }}
                  filterable={false}
                  selectedItem={value}
                  selectedItemProp={'value'}
                  textProp={'name'}
                  popoverProps={{ minimal: true }}
                />
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
    </div>
  );
}
