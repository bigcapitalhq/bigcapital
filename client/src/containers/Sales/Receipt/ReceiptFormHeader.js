import React, { useMemo, useCallback, useState } from 'react';
import { FormGroup, InputGroup, Intent, Position } from '@blueprintjs/core';

import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import moment from 'moment';
import { momentFormatter, compose, tansformDateValue, saveInvoke } from 'utils';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import {
  AccountsSelectList,
  ContactSelecetList,
  ErrorMessage,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
} from 'components';

import withCustomers from 'containers/Customers/withCustomers';
import withAccounts from 'containers/Accounts/withAccounts';
import withDialogActions from 'containers/Dialog/withDialogActions';

function ReceiptFormHeader({
  formik: { errors, touched, setFieldValue, getFieldProps, values },

  //#withCustomers
  customers,

  //#withAccouts
  accountsList,

  //#withDialogActions
  openDialog,

  // #ownProps
  onReceiptNumberChanged,
}) {
  const handleDateChange = useCallback(
    (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue('receipt_date', formatted);
    },
    [setFieldValue],
  );

  // handle change
  const onChangeSelect = useCallback(
    (filedName) => {
      return (item) => {
        setFieldValue(filedName, item.id);
      };
    },
    [setFieldValue],
  );

  // Filter deposit accounts.
  const depositAccounts = useMemo(
    () => accountsList.filter((a) => a?.type?.key === 'current_asset'),
    [accountsList],
  );

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
        <FormGroup
          label={<T id={'customer_name'} />}
          inline={true}
          className={classNames(
            'form-group--select-list',
            CLASSES.FILL,
            'form-group--customer',
          )}
          labelInfo={<FieldRequiredHint />}
          intent={errors.customer_id && touched.customer_id && Intent.DANGER}
          helperText={
            <ErrorMessage name={'customer_id'} {...{ errors, touched }} />
          }
        >
          <ContactSelecetList
            contactsList={customers}
            selectedContactId={values.customer_id}
            defaultSelectText={<T id={'select_customer_account'} />}
            onContactSelected={onChangeSelect('customer_id')}
          />
        </FormGroup>

        {/* ----------- Deposit account ----------- */}
        <FormGroup
          label={<T id={'deposit_account'} />}
          className={classNames(
            'form-group--deposit-account',
            'form-group--select-list',
            CLASSES.FILL,
          )}
          inline={true}
          labelInfo={<FieldRequiredHint />}
          intent={
            errors.deposit_account_id &&
            touched.deposit_account_id &&
            Intent.DANGER
          }
          helperText={
            <ErrorMessage
              name={'deposit_account_id'}
              {...{ errors, touched }}
            />
          }
        >
          <AccountsSelectList
            accounts={depositAccounts}
            onAccountSelected={onChangeSelect('deposit_account_id')}
            defaultSelectText={<T id={'select_deposit_account'} />}
            selectedAccountId={values.deposit_account_id}
          />
        </FormGroup>
        {/* ----------- Receipt date ----------- */}
        <FormGroup
          label={<T id={'receipt_date'} />}
          inline={true}
          className={classNames('form-group--select-list', CLASSES.FILL)}
          intent={errors.receipt_date && touched.receipt_date && Intent.DANGER}
          helperText={
            <ErrorMessage name="receipt_date" {...{ errors, touched }} />
          }
        >
          <DateInput
            {...momentFormatter('YYYY/MM/DD')}
            value={tansformDateValue(values.receipt_date)}
            onChange={handleDateChange}
            popoverProps={{ position: Position.BOTTOM, minimal: true }}
          />
        </FormGroup>

        {/* ----------- Receipt number ----------- */}
        <FormGroup
          label={<T id={'receipt'} />}
          inline={true}
          className={('form-group--receipt_number', CLASSES.FILL)}
          labelInfo={<FieldRequiredHint />}
          intent={
            errors.receipt_number && touched.receipt_number && Intent.DANGER
          }
          helperText={
            <ErrorMessage name="receipt_number" {...{ errors, touched }} />
          }
        >
          <InputGroup
            intent={
              errors.receipt_number && touched.receipt_number && Intent.DANGER
            }
            minimal={true}
            rightElement={
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
            }
            {...getFieldProps('receipt_number')}
            onBlur={handleReceiptNumberChanged}
          />
        </FormGroup>

        {/* ----------- Reference ----------- */}
        <FormGroup
          label={<T id={'reference'} />}
          inline={true}
          className={classNames('form-group--reference', CLASSES.FILL)}
          intent={errors.reference_no && touched.reference_no && Intent.DANGER}
          helperText={
            <ErrorMessage name="reference" {...{ errors, touched }} />
          }
        >
          <InputGroup
            intent={
              errors.reference_no && touched.reference_no && Intent.DANGER
            }
            minimal={true}
            {...getFieldProps('reference_no')}
          />
        </FormGroup>
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
