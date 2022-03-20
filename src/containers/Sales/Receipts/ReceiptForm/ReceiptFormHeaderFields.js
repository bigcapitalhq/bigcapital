import React, { useCallback } from 'react';
import {
  FormGroup,
  InputGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'components';
import classNames from 'classnames';
import { FastField, ErrorMessage } from 'formik';
import { CLASSES } from 'common/classes';
import styled from 'styled-components';

import {
  AccountsSelectList,
  CustomerSelectField,
  FieldRequiredHint,
  Icon,
  If,
  InputPrependButton,
  CustomerDrawerLink,
} from 'components';
import withSettings from 'containers/Settings/withSettings';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { ACCOUNT_TYPE } from 'common/accountTypes';
import {
  momentFormatter,
  compose,
  tansformDateValue,
  handleDateChange,
  inputIntent,
} from 'utils';
import { useReceiptFormContext } from './ReceiptFormProvider';
import {
  accountsFieldShouldUpdate,
  customersFieldShouldUpdate,
  useObserveReceiptNoSettings,
} from './utils';
import { ReceiptExchangeRateInputField } from './components';

/**
 * Receipt form header fields.
 */
function ReceiptFormHeader({
  //#withDialogActions
  openDialog,

  // #withSettings
  receiptAutoIncrement,
  receiptNextNumber,
  receiptNumberPrefix,
}) {
  const { accounts, customers } = useReceiptFormContext();

  const handleReceiptNumberChange = useCallback(() => {
    openDialog('receipt-number-form', {});
  }, [openDialog]);

  const handleReceiptNoBlur = (form, field) => (event) => {
    const newValue = event.target.value;

    if (field.value !== newValue && receiptAutoIncrement) {
      openDialog('receipt-number-form', {
        initialFormValues: {
          manualTransactionNo: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
  };

  // Synsc receipt number settings with the form.
  useObserveReceiptNoSettings(receiptNumberPrefix, receiptNextNumber);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ----------- Customer name ----------- */}
      <FastField
        name={'customer_id'}
        customers={customers}
        shouldUpdate={customersFieldShouldUpdate}
      >
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'customer_name'} />}
            inline={true}
            className={classNames(CLASSES.FILL, 'form-group--customer')}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'customer_id'} />}
          >
            <ControlCustomerGroup>
              <CustomerSelectField
                contacts={customers}
                selectedContactId={value}
                defaultSelectText={<T id={'select_customer_account'} />}
                onContactSelected={(customer) => {
                  form.setFieldValue('customer_id', customer.id);
                  form.setFieldValue('currency_code', customer?.currency_code);
                }}
                popoverFill={true}
                allowCreate={true}
              />
            </ControlCustomerGroup>
            {value && (
              <CustomerButtonLink customerId={value}>
                View Customer Details
              </CustomerButtonLink>
            )}
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Exchange rate ----------- */}
      <ReceiptExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />

      {/* ----------- Deposit account ----------- */}
      <FastField
        name={'deposit_account_id'}
        accounts={accounts}
        shouldUpdate={accountsFieldShouldUpdate}
      >
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'deposit_account'} />}
            className={classNames('form-group--deposit-account', CLASSES.FILL)}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'deposit_account_id'} />}
          >
            <AccountsSelectList
              accounts={accounts}
              onAccountSelected={(account) => {
                form.setFieldValue('deposit_account_id', account.id);
              }}
              defaultSelectText={<T id={'select_deposit_account'} />}
              selectedAccountId={value}
              popoverFill={true}
              filterByTypes={[
                ACCOUNT_TYPE.CASH,
                ACCOUNT_TYPE.BANK,
                ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
              ]}
              allowCreate={true}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Receipt date ----------- */}
      <FastField name={'receipt_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'receipt_date'} />}
            inline={true}
            className={classNames(CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="receipt_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('receipt_date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Receipt number ----------- */}
      <FastField name={'receipt_number'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'receipt'} />}
            inline={true}
            className={('form-group--receipt_number', CLASSES.FILL)}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="receipt_number" />}
          >
            <ControlGroup fill={true}>
              <InputGroup
                minimal={true}
                value={field.value}
                asyncControl={true}
                onBlur={handleReceiptNoBlur(form, field)}
              />
              <InputPrependButton
                buttonProps={{
                  onClick: handleReceiptNumberChange,
                  icon: <Icon icon={'settings-18'} />,
                }}
                tooltip={true}
                tooltipProps={{
                  content: (
                    <T
                      id={'setting_your_auto_generated_payment_receive_number'}
                    />
                  ),
                  position: Position.BOTTOM_LEFT,
                }}
                inputProps={{
                  leftIcon: <Icon icon={'date-range'} />,
                }}
              />
            </ControlGroup>
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Reference ----------- */}
      <FastField name={'reference_no'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reference'} />}
            inline={true}
            className={classNames('form-group--reference', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="reference_no" />}
          >
            <InputGroup minimal={true} {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

export default compose(
  withDialogActions,
  withSettings(({ receiptSettings }) => ({
    receiptAutoIncrement: receiptSettings?.autoIncrement,
    receiptNextNumber: receiptSettings?.nextNumber,
    receiptNumberPrefix: receiptSettings?.numberPrefix,
  })),
)(ReceiptFormHeader);

const ControlCustomerGroup = styled(ControlGroup)`
  display: flex;
  align-items: center;
  transform: none;
`;

const CustomerButtonLink = styled(CustomerDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
