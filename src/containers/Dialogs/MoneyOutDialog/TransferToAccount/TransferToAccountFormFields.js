import React from 'react';
import { FastField, Field, ErrorMessage } from 'formik';
import {
  Classes,
  FormGroup,
  InputGroup,
  TextArea,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import classNames from 'classnames';
import {
  FormattedMessage as T,
  AccountsSuggestField,
  InputPrependText,
  MoneyInputGroup,
  FieldRequiredHint,
  Icon,
  Col,
  Row,
  InputPrependButton,
} from 'components';
import { DateInput } from '@blueprintjs/datetime';
import { useAutofocus } from 'hooks';
import { ACCOUNT_TYPE } from 'common/accountTypes';

import {
  inputIntent,
  momentFormatter,
  tansformDateValue,
  handleDateChange,
  compose,
} from 'utils';
import { CLASSES } from 'common/classes';
import { useMoneyOutDialogContext } from '../MoneyOutDialogProvider';
import { useObserveTransactionNoSettings } from '../utils';
import withSettings from 'containers/Settings/withSettings';
import withDialogActions from 'containers/Dialog/withDialogActions';

/**
 * Transfer to account form fields.
 */
function TransferToAccountFormFields({
  // #withDialogActions
  openDialog,

  // #withSettings
  transactionAutoIncrement,
  transactionNumberPrefix,
  transactionNextNumber,
}) {
  // Money in dialog context.
  const { accounts } = useMoneyOutDialogContext();

  const accountRef = useAutofocus();

  // Handle tranaction number changing.
  const handleTransactionNumberChange = () => {
    openDialog('transaction-number-form');
  };

  // Handle transaction no. field blur.
  const handleTransactionNoBlur = (form, field) => (event) => {
    const newValue = event.target.value;

    if (field.value !== newValue && transactionAutoIncrement) {
      openDialog('transaction-number-form', {
        initialFormValues: {
          manualTransactionNo: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
  };

  // Syncs transaction number settings with form.
  useObserveTransactionNoSettings(
    transactionNumberPrefix,
    transactionNextNumber,
  );

  return (
    <React.Fragment>
      <Row>
        <Col xs={5}>
          {/*------------ Date -----------*/}
          <FastField name={'date'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'date'} />}
                labelInfo={<FieldRequiredHint />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="date" />}
                minimal={true}
                className={classNames(CLASSES.FILL, 'form-group--date')}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  onChange={handleDateChange((formattedDate) => {
                    form.setFieldValue('date', formattedDate);
                  })}
                  value={tansformDateValue(value)}
                  popoverProps={{
                    position: Position.BOTTOM,
                    minimal: true,
                  }}
                  intent={inputIntent({ error, touched })}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
        <Col xs={5}>
          {/*------------ Transaction number -----------*/}
          <Field name={'transaction_number'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'transaction_number'} />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="transaction_number" />}
                className={'form-group--transaction_number'}
              >
                <ControlGroup fill={true}>
                  <InputGroup
                    minimal={true}
                    value={field.value}
                    asyncControl={true}
                    onBlur={handleTransactionNoBlur(form, field)}
                  />
                  <InputPrependButton
                    buttonProps={{
                      onClick: handleTransactionNumberChange,
                      icon: <Icon icon={'settings-18'} />,
                    }}
                    tooltip={true}
                    tooltipProps={{
                      content: (
                        <T
                          id={
                            'cash_flow.setting_your_auto_generated_transaction_number'
                          }
                        />
                      ),
                      position: Position.BOTTOM_LEFT,
                    }}
                  />
                </ControlGroup>
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
      {/*------------ amount -----------*/}
      <FastField name={'amount'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={<T id={'amount'} />}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="amount" />}
            className={'form-group--amount'}
          >
            <ControlGroup>
              <InputPrependText text={values.currency_code} />

              <MoneyInputGroup
                value={value}
                minimal={true}
                onChange={(amount) => {
                  setFieldValue('amount', amount);
                }}
                inputRef={accountRef}
                intent={inputIntent({ error, touched })}
              />
            </ControlGroup>
          </FormGroup>
        )}
      </FastField>

      <Row>
        <Col xs={5}>
          {/*------------ transfer from account -----------*/}
          <FastField name={'credit_account_id'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={
                  <T id={'cash_flow_transaction.label_transfer_to_account'} />
                }
                labelInfo={<FieldRequiredHint />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="credit_account_id" />}
                className={'form-group--credit_account_id'}
              >
                <AccountsSuggestField
                  accounts={accounts}
                  onAccountSelected={({ id }) =>
                    form.setFieldValue('credit_account_id', id)
                  }
                  filterByTypes={[
                    ACCOUNT_TYPE.CASH,
                    ACCOUNT_TYPE.BANK,
                    ACCOUNT_TYPE.CREDIT_CARD,
                  ]}
                  inputProps={{
                    intent: inputIntent({ error, touched }),
                  }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
        <Col xs={5}>
          {/*------------ Reference -----------*/}
          <FastField name={'reference_no'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'reference_no'} />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="reference_no" />}
                className={'form-group--reference-no'}
              >
                <InputGroup
                  intent={inputIntent({ error, touched })}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
      {/*------------ description -----------*/}
      <FastField name={'description'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'description'} />}
            className={'form-group--description'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'description'} />}
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
    </React.Fragment>
  );
}
export default compose(
  withDialogActions,
  withSettings(({ cashflowSetting }) => ({
    transactionAutoIncrement: cashflowSetting?.autoIncrement,
    transactionNextNumber: cashflowSetting?.nextNumber,
    transactionNumberPrefix: cashflowSetting?.numberPrefix,
  })),
)(TransferToAccountFormFields);
