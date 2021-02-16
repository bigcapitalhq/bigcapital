import React, { useMemo } from 'react';
import {
  FormGroup,
  InputGroup,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import { FastField, useFormikContext } from 'formik';
import { sumBy } from 'lodash';

import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import { momentFormatter, tansformDateValue, inputIntent } from 'utils';
import {
  AccountsSelectList,
  ContactSelecetList,
  ErrorMessage,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
  MoneyInputGroup,
  InputPrependText,
  Hint,
  Money,
} from 'components';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';

import withSettings from 'containers/Settings/withSettings';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

/**
 * Payment receive header fields.
 */
function PaymentReceiveHeaderFields({ baseCurrency }) {
  // Payment receive form context.
  const { customers, accounts, isNewMode } = usePaymentReceiveFormContext();

  // Formik form context.
  const { values } = useFormikContext();

  const fullAmountReceived = useMemo(
    () => sumBy(values.entries, 'payment_amount'),
    [values.entries],
  );

  const handleReceiveFullAmountClick = () => {};

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ------------- Customer name ------------- */}
      <FastField name={'customer_id'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'customer_name'} />}
            inline={true}
            className={classNames('form-group--select-list', CLASSES.FILL)}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'customer_id'} />}
          >
            <ContactSelecetList
              contactsList={customers}
              selectedContactId={value}
              defaultSelectText={<T id={'select_customer_account'} />}
              onContactSelected={(value) => {
                form.setFieldValue('customer_id', value);
              }}
              popoverFill={true}
              disabled={!isNewMode}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------------- Payment date ------------- */}
      <FastField name={'payment_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'payment_date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--select-list', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="payment_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              // onChange={handleDateChange('payment_date')}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------------ Full amount ------------ */}
      <FastField name={'customer_name'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'full_amount'} />}
            inline={true}
            className={('form-group--full-amount', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            labelInfo={<Hint />}
            helperText={<ErrorMessage name="full_amount" />}
          >
            <ControlGroup>
              <InputPrependText text={baseCurrency} />
              <MoneyInputGroup
                inputGroupProps={{
                  medium: true,
                  ...field,
                }}
              />
            </ControlGroup>

            <a
              onClick={handleReceiveFullAmountClick}
              href="#"
              className={'receive-full-amount'}
            >
              Receive full amount (
              <Money amount={fullAmountReceived} currency={baseCurrency} />)
            </a>
          </FormGroup>
        )}
      </FastField>

      {/* ------------ Payment receive no. ------------ */}
      <FastField name={'payment_receive_no'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'payment_receive_no'} />}
            inline={true}
            className={('form-group--payment_receive_no', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="payment_receive_no" />}
          >
            <ControlGroup fill={true}>
              <InputGroup
                intent={inputIntent({ error, touched })}
                minimal={true}
                {...field}
              />
              <InputPrependButton
                buttonProps={{
                  //   onClick: handlePaymentReceiveNumberChange,
                  icon: <Icon icon={'settings-18'} />,
                }}
                tooltip={true}
                tooltipProps={{
                  content: 'Setting your auto-generated Payment Receive number',
                  position: Position.BOTTOM_LEFT,
                }}
              />
            </ControlGroup>
          </FormGroup>
        )}
      </FastField>

      {/* ------------ Deposit account ------------ */}
      <FastField name={'deposit_account_id'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'deposit_to'} />}
            className={classNames(
              'form-group--deposit_account_id',
              'form-group--select-list',
              CLASSES.FILL,
            )}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'deposit_account_id'} />}
          >
            <AccountsSelectList
              accounts={accounts}
              labelInfo={<FieldRequiredHint />}
              onAccountSelected={(account) => {
                form.setFieldValue('deposit_account_id', account.id);
              }}
              defaultSelectText={<T id={'select_deposit_account'} />}
              selectedAccountId={value}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------------ Reference No. ------------ */}
      <FastField name={'customer_name'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reference'} />}
            inline={true}
            className={classNames('form-group--reference', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="reference" />}
          >
            <InputGroup
              intent={inputIntent({ error, touched })}
              minimal={true}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
  withDialogActions,
)(PaymentReceiveHeaderFields);
