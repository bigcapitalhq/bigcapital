import React, { useCallback } from 'react';
import {
  FormGroup,
  InputGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';

import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import { FastField, ErrorMessage } from 'formik';

import { CLASSES } from 'common/classes';
import {
  AccountsSelectList,
  ContactSelecetList,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
} from 'components';

import withCustomers from 'containers/Customers/withCustomers';
import withAccounts from 'containers/Accounts/withAccounts';
import withDialogActions from 'containers/Dialog/withDialogActions';

import {
  momentFormatter,
  compose,
  tansformDateValue,
  saveInvoke,
  handleDateChange,
  inputIntent,
} from 'utils';


function ReceiptFormHeader({
  //#withCustomers
  customers,

  //#withAccouts
  accountsList,

  //#withDialogActions
  openDialog,

  // #ownProps
  onReceiptNumberChanged,
}) {
  const handleReceiptNumberChange = useCallback(() => {
    openDialog('receipt-number-form', {});
  }, [openDialog]);

  const handleReceiptNumberChanged = (event) => {
    saveInvoke(onReceiptNumberChanged, event.currentTarget.value);
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <div className={classNames(CLASSES.PAGE_FORM_HEADER_PRIMARY)}>
        {/* ----------- Customer name ----------- */}
        <FastField name={'customer_id'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'customer_name'} />}
              inline={true}
              className={classNames(CLASSES.FILL, 'form-group--customer')}
              labelInfo={<FieldRequiredHint />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name={'customer_id'} />}
            >
              <ContactSelecetList
                contactsList={customers}
                selectedContactId={value}
                defaultSelectText={<T id={'select_customer_account'} />}
                onContactSelected={(contact) => {
                  form.setFieldValue('customer_id', contact.id);
                }}
              />
            </FormGroup>
          )}
        </FastField>

        {/* ----------- Deposit account ----------- */}
        <FastField name={'deposit_account_id'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'deposit_account'} />}
              className={classNames(
                'form-group--deposit-account',
                CLASSES.FILL,
              )}
              inline={true}
              labelInfo={<FieldRequiredHint />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name={'deposit_account_id'} />}
            >
              <AccountsSelectList
                accounts={accountsList}
                onAccountSelected={(account) => {
                  form.setFieldValue('deposit_account_id', account.id);
                }}
                defaultSelectText={<T id={'select_deposit_account'} />}
                selectedAccountId={value}
                filterByTypes={['current_asset']}
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
              />
            </FormGroup>
          )}
        </FastField>

        {/* ----------- Receipt number ----------- */}
        <FastField name={'receipt_number'}>
          {({ field, meta: { error, touched } }) => (
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
                  {...field}
                  onBlur={handleReceiptNumberChanged}
                />
                <InputPrependButton
                  buttonProps={{
                    onClick: handleReceiptNumberChange,
                    icon: <Icon icon={'settings-18'} />,
                  }}
                  tooltip={true}
                  tooltipProps={{
                    content: 'Setting your auto-generated receipt number',
                    position: Position.BOTTOM_LEFT,
                  }}
                />
              </ControlGroup>
            </FormGroup>
          )}
        </FastField>

        {/* ----------- Reference ----------- */}
        <FastField name={'reference'}>
          {({ field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'reference'} />}
              inline={true}
              className={classNames('form-group--reference', CLASSES.FILL)}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="reference" />}
            >
              <InputGroup minimal={true} {...field} />
            </FormGroup>
          )}
        </FastField>
      </div>
    </div>
  );
}

export default compose(
  withCustomers(({ customers }) => ({
    customers,
  })),
  withAccounts(({ accountsList }) => ({
    accountsList,
  })),
  withDialogActions,
)(ReceiptFormHeader);
