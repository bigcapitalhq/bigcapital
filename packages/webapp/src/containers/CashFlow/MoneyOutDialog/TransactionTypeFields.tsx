// @ts-nocheck
import React, { useMemo } from 'react';
import { FastField, ErrorMessage } from 'formik';
import { FormGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import {
  FormattedMessage as T,
  AccountsSuggestField,
  FieldRequiredHint,
  Col,
  Row,
  FSelect,
  FFormGroup,
} from '@/components';
import { inputIntent } from '@/utils';
import { getAddMoneyOutOptions } from '@/constants/cashflowOptions';
import { useMoneyOutDialogContext } from './MoneyOutDialogProvider';
import { CLASSES } from '@/constants/classes';

/**
 * Transaction type fields.
 */
function TransactionTypeFields() {
  // Money in dialog context.
  const { cashflowAccounts } = useMoneyOutDialogContext();

  const addMoneyOutOptions = useMemo(() => getAddMoneyOutOptions(), []);

  // Money in dialog context.
  const { defaultAccountId, setAccountId } = useMoneyOutDialogContext();

  // Cannot continue if the default account id is defined.
  if (defaultAccountId) return null;

  return (
    <div className="trasnaction-type-fileds">
      <Row>
        {/*------------ Transaction type -----------*/}
        <Col xs={5}>
          <FFormGroup
            name={'transaction_type'}
            label={<T id={'transaction_type'} />}
            labelInfo={<FieldRequiredHint />}
          >
            <FSelect
              name={'transaction_type'}
              items={addMoneyOutOptions}
              popoverProps={{ minimal: true }}
              valueAccessor={'value'}
              textAccessor={'name'}
            />
          </FFormGroup>
        </Col>

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
                  onAccountSelected={({ id }) => {
                    form.setFieldValue('cashflow_account_id', id);
                    setAccountId(id);
                  }}
                  inputProps={{
                    intent: inputIntent({ error, touched }),
                  }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
    </div>
  );
}

export default TransactionTypeFields;
