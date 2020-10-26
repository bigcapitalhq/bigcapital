import React, { useMemo, useCallback, useState } from 'react';
import {
  FormGroup,
  InputGroup,
  Intent,
  Position,
  MenuItem,
  Classes,
} from '@blueprintjs/core';

import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import moment from 'moment';
import { momentFormatter, compose, tansformDateValue } from 'utils';
import classNames from 'classnames';
import {
  AccountsSelectList,
  ListSelect,
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
}) {
  const handleDateChange = useCallback(
    (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue('receipt_date', formatted);
    },
    [setFieldValue],
  );

  const CustomerRenderer = useCallback(
    (cutomer, { handleClick }) => (
      <MenuItem
        key={cutomer.id}
        text={cutomer.display_name}
        onClick={handleClick}
      />
    ),
    [],
  );

  // Filter Customer
  const filterCustomer = (query, customer, _index, exactMatch) => {
    const normalizedTitle = customer.display_name.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return (
        `${customer.display_name} ${normalizedTitle}`.indexOf(
          normalizedQuery,
        ) >= 0
      );
    }
  };

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

  return (
    <div class="page-form receipt-form">
      <div class="page-form__primary-section">
        {/*- Customer name -*/}
        <FormGroup
          label={<T id={'customer_name'} />}
          inline={true}
          className={classNames(
            'form-group--select-list',
            Classes.FILL,
            'form-group--customer',
          )}
          labelInfo={<FieldRequiredHint />}
          intent={errors.customer_id && touched.customer_id && Intent.DANGER}
          helperText={
            <ErrorMessage name={'customer_id'} {...{ errors, touched }} />
          }
        >
          <ListSelect
            items={customers}
            noResults={<MenuItem disabled={true} text="No results." />}
            itemRenderer={CustomerRenderer}
            itemPredicate={filterCustomer}
            popoverProps={{ minimal: true }}
            onItemSelect={onChangeSelect('customer_id')}
            selectedItem={values.customer_id}
            selectedItemProp={'id'}
            defaultText={<T id={'select_customer_account'} />}
            labelProp={'display_name'}
          />
        </FormGroup>

        {/*- Deposit account -*/}
        <FormGroup
          label={<T id={'deposit_account'} />}
          className={classNames(
            'form-group--deposit-account',
            'form-group--select-list',
            Classes.FILL,
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

        <FormGroup
          label={<T id={'receipt_date'} />}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
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
      </div>
      {/* receipt_no */}
      <FormGroup
        label={<T id={'receipt'} />}
        inline={true}
        className={('form-group--receipt_number', Classes.FILL)}
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
        />
      </FormGroup>

      {/*- Reference -*/}
      <FormGroup
        label={<T id={'reference'} />}
        inline={true}
        className={classNames('form-group--reference', Classes.FILL)}
        intent={errors.reference_no && touched.reference_no && Intent.DANGER}
        helperText={<ErrorMessage name="reference" {...{ errors, touched }} />}
      >
        <InputGroup
          intent={errors.reference_no && touched.reference_no && Intent.DANGER}
          minimal={true}
          {...getFieldProps('reference_no')}
        />
      </FormGroup>

      {/*- Send to email -*/}
      <FormGroup
        label={<T id={'send_to_email'} />}
        inline={true}
        className={classNames('form-group--send_to_email', Classes.FILL)}
        intent={errors.send_to_email && touched.send_to_email && Intent.DANGER}
        helperText={<ErrorMessage name="reference" {...{ errors, touched }} />}
      >
        <InputGroup
          intent={
            errors.send_to_email && touched.send_to_email && Intent.DANGER
          }
          minimal={true}
          {...getFieldProps('send_to_email')}
        />
      </FormGroup>
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
